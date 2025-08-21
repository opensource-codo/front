import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function useAgent({ onExpandFull } = {}) {
  const [interactionId, setInteractionId] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      text: '안녕하세요! 무엇을 도와드릴까요?',
      type: 'system',
      timestamp: new Date().toISOString(),
      markdown: false,
    },
  ]);

  const [ui, setUi] = useState({
    guide: null,
    missing: null,
    confirm: null,
    console: null,
    toast: null,
    error: null,
  });

  const onExpandFullRef = useRef(onExpandFull);
  useEffect(() => {
    onExpandFullRef.current = onExpandFull;
  }, [onExpandFull]);

  const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  const ENDPOINT = '/api/v1/userInputRe/';

  const addMessage = (text, type = 'user', {markdown=false} = {}) => {
    const newMessage = {
      id: Date.now(),
      text,
      type,
      timestamp: new Date().toISOString(),
      markdown,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addBotMessage = (text) => {
    addMessage(text, 'bot', {markdown: true});
  };

  const addSystemMessage = (text) => {
    addMessage(text, 'system', { markdown: false });
  };

  const route = (data) => {
    setLastResponse(data);

    // ✅ interaction_Id -> interaction_id
    if (data?.interaction_id) setInteractionId(data.interaction_id);

    const next = {
      guide: null,
      missing: null,
      confirm: null,
      error: null,
      toast: null,
      console: null,
    };

    switch (data?.status) {
      case 'guide_completed': {
        next.guide = { shortcut: data.shortcut || null, schema: data.parameter_schema || null };
        if (data.message) addBotMessage(data.message);
        break;
      }

      case 'info_required': {
        next.missing = { schema: data.parameter_schema ?? null, required: data.missing_params ?? [] };
        if (data.message) addBotMessage(data.message);
        break;
      }

      case 'confirm_required': {
        next.confirm = { intent: data.intent, params: data.parameters };
        if (data.message) addBotMessage(data.message);
        break;
      }

      case 'ready_to_execute': {
        // 선택: UX상 알림만. 필요 시 confirm과 동일 동작으로 바꿔도 됨.
        next.toast = { type: 'info', text: data.message || '실행 준비가 완료되었습니다.' };
        break;
      }

      case 'executed': {
        next.toast = { type: 'success', text: data.message || '완료되었습니다.' };
        if (data.message) addBotMessage(data.message);
        if (data.exec ? data.exec !== 'guide' : (data.output_type && data.output_type !== 'guide')) {
          onExpandFullRef.current?.();
        }
        break;
      }

      case 'cancelled': {
        next.toast = { type: 'info', text: data.message || '사용자 취소' };
        if (data.message) addBotMessage(data.message);
        break;
      }

      case 'error':
      case 'execution_failed': { 
        next.error = { message: data.message || '실행 중 오류가 발생했습니다.', details: data.errors || [] };
        if (data.message) addBotMessage(data.message);
        break;
      }

      case 'unknown_method': {
        next.toast = { type: 'warning', text: data.message || '지원되지 않는 method입니다.' };
        if (data.message) addBotMessage(data.message);
        break;
      }

      case 'low_confidence':
      case 'no_intent':
      default:
        break;
    }

    setUi(next);
  };

  const call = async (payload) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}${ENDPOINT}`, payload);
      route(res.data);
      return res.data;
    } catch (e) {
      // 네트워크/서버 오류 토스트
      setUi((prev) => ({
        ...prev,
        error: { message: '요청 중 오류가 발생했습니다.', details: [String(e?.message || e)] },
        toast: { type: 'error', text: '요청 실패' },
      }));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // 일반 전송
  const send = ({ text, method = 'GUIDE', parameters = {} }) => {
    addMessage(text, 'user');
    const payload = {
      text,
      method: String(method).toUpperCase(),
      parameters,
      interaction_id: interactionId, 
    };
    return call(payload);
  };

  // GUIDE → EXECUTION
  const goToExecution = () =>
    call({
      ...lastResponse,
      method: 'EXECUTION',
      parameters: lastResponse?.parameters || {},
      interaction_id: interactionId,
    });

  // 누락 파라미터 제출
  const submitMissingParams = (filled) =>
    call({
      ...lastResponse,
      method: 'EXECUTION',
      parameters: { ...(lastResponse?.parameters || {}), ...filled },
      interaction_id: interactionId,
    });

  // 확인 / 취소
  const confirmExecution = () =>
    call({ ...lastResponse, method: 'EXECUTION', confirm: true, interaction_id: interactionId });

  const cancelExecution = () =>
    call({ ...lastResponse, method: 'EXECUTION', cancel: true, interaction_id: interactionId });

  return {
    interactionId,
    lastResponse,
    loading,
    ui,
    messages,
    addMessage,
    addBotMessage,
    addSystemMessage,
    send,
    goToExecution,
    submitMissingParams,
    confirmExecution,
    cancelExecution,
  };
}
