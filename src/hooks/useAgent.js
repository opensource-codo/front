import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

/**
 * 백엔드 공통 스키마 응답을 받아
 * - ui(guide/missing/confirm/error/toast)
 * - loading, lastResponse, interactionId
 * 를 관리하는 훅입니다.
 */

export default function useAgent({ onExpandFull } = {}) {
    const [interactionId, setInteractionId ] = useState(null);
    const [lastResponse, setLastResponse] = useState(null);
    const [loading,setLoading] = useState(false);
    const [messages, setMessages] = useState([
        // 초기 시스템 메시지
        {
            id: Date.now(),
            text: '안녕하세요! 무엇을 도와드릴까요?',
            type: 'system',
            timestamp: new Date().toISOString()
        }
    ]); // 메시지 히스토리 추가
    const [ui,setUi] = useState({
        guide: null,
        missing: null,
        confirm: null,
        console: null,
        toast: null,
        
    });

    // onExpandFull 콜백을 동적으로 업데이트할 수 있도록 ref 사용
    const onExpandFullRef = useRef(onExpandFull);
    
    // onExpandFull이 변경되면 ref 업데이트
    useEffect(() => {
        onExpandFullRef.current = onExpandFull;
    }, [onExpandFull]);

    const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

    // 메시지 추가 함수
    const addMessage = (text, type = 'user') => {
        const newMessage = {
            id: Date.now(),
            text,
            type,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    // 봇 응답 메시지 추가
    const addBotMessage = (text) => {
        addMessage(text, 'bot');
    };

    // 시스템 메시지 추가
    const addSystemMessage = (text) => {
        addMessage(text, 'system');
    };

    const route = (data) => {
        setLastResponse(data);
        if (data?.interaction_Id) setInteractionId(data.interaction_Id);

        const next = {guide:null, missing:null, confirm:null, error:null, toast:null };

        switch (data?.status) {
            case 'guide_completed':
                next.guide = { shortcut: data.shortcut, schema: data.parameter_schema };
                // 봇 응답 메시지 추가
                if (data.message) {
                    addBotMessage(data.message);
                }
                break;
            
            case 'info_required':
                next.missing = { schema: data.parameter_schema, required: data.missing_parameter };
                break;

            case 'confirm_required' :
                next.confirm = { intent: data.intent, params: data.parameters };
                break;

            case 'executed':
                next.toast = { type: 'success', text: data.message || '완료되었습니다.' };
                // 실행 완료 메시지 추가
                if (data.message) {
                    addBotMessage(data.message);
                }
                if (data.output_type && data.output_type !== 'guide') onExpandFullRef.current?.();
                break;

            case 'cancelled':
                next.toast = { type: 'info', text: data.message || '사용자 취소' };
                break;

            case 'execution_failed':
                next.error = { message: data.message, details: data.errors || [] };
                // 에러 메시지 추가
                if (data.message) {
                    addBotMessage(data.message);
                }
                break;

            case 'unknown_method':
                next.toast = { type: 'warning', text: data.message || '지원되지 않는 method입니다.' };
                break;

            case 'low_confidence':
            case 'no_intent':
            default:
            // 특별히 보여줄 UI 없음(필요시 확장 가능)
            break;
        }

        setUi(next);

    };

    const call = async (payload) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/v1/userInput`, payload);
            route(res.data);
            return res.data;
        } finally {
            setLoading(false);
        }
    };

    //일반 전송
    const send = ({text, method = 'GUIDE', parameters = {}}) => {
        // 사용자 메시지 추가
        addMessage(text, 'user');
        
        const payload = {
            text,
            method: String(method).toUpperCase(),
            parameters,
            interaction_id: interactionId
        };
        return call(payload);
    };

    // GUIDE → EXECUTION
    const goToExecution = () =>
        call({
        ...lastResponse,
        method: 'EXECUTION',
        parameters: lastResponse?.parameters || {}
        });

    
    // 누락 파라미터 제출
    const submitMissingParams = (filled) =>
        call({
        ...lastResponse,
        method: 'EXECUTION',
        parameters: { ...(lastResponse?.parameters || {}), ...filled }
        });

    // 확인 / 취소
    const confirmExecution = () =>
        call({ ...lastResponse, method: 'EXECUTION', confirm: true });

    const cancelExecution = () =>
        call({ ...lastResponse, method: 'EXECUTION', cancel: true });

    return {
        interactionId,
        lastResponse,
        loading,
        ui,
        messages, // 메시지 히스토리 추가
        addMessage, // 메시지 추가 함수 추가
        addBotMessage, // 봇 메시지 추가 함수 추가
        addSystemMessage, // 시스템 메시지 추가 함수 추가
        send,
        goToExecution,
        submitMissingParams,
        confirmExecution,
        cancelExecution,
    };
    } 