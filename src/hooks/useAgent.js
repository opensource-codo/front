import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, ENDPOINT_BASE, SIMPLE_EXEC_ENDPOINT } from '../api/endpoints';

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
    },
  ]);

  const [ui, setUi] = useState({
    guide: null,
    missing: null,
    confirm: null,
    console: null,   // 실행 계획/출력 표시용
    toast: null,
    error: null,
    meta: null,
  });

  const onExpandFullRef = useRef(onExpandFull);
  useEffect(() => {
    onExpandFullRef.current = onExpandFull;
  }, [onExpandFull]);

  const lastUserTextRef = useRef('');               // EXECUTION 전환 시 텍스트 보존

  // ───────────────────────── helpers ─────────────────────────
  const addMessage = (text, type = 'user', markdown) => {
    const newMessage = {
      id: Date.now(),
      text,
      type,
      timestamp: new Date().toISOString(),
      markdown: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addBotMessage = (text) => addMessage(text, 'bot');
  const addSystemMessage = (text) => addMessage(text, 'system');

  const handleApiError = (e) => {
    setUi((prev) => ({
      ...prev,
      error: { message: '요청 중 오류가 발생했습니다.', details: [String(e?.message || e)] },
      toast: { type: 'error', text: '요청 실패' },
    }));
  };

  const route = (data) => {
    setLastResponse(data);

    if (data?.interaction_id) setInteractionId(data.interaction_id);

    const next = {
      guide: null,
      missing: null,
      confirm: null,
      error: null,
      toast: null,
      console: null,
      meta: { intent: data?.intent, methodUsed: data?.method_used, similarity: data?.similarity },
    };

    switch (data?.status) {
      case 'guide_completed': {
        next.guide = { shortcut: data.shortcut || null, schema: data.parameter_schema || null };
        if (data.message) addBotMessage(data.message);
        break;
      }
      case 'info_required': {
        next.missing = { schema: data.parameter_schema || null, required: data.missing_params || [] };
        break;
      }
      case 'confirm_required': {
        next.confirm = { intent: data.intent, params: data.parameters || {} };
        break;
      }
      case 'ready_to_execute': {
        next.toast = { type: 'info', text: data.message || '실행 준비가 완료되었습니다.' };
        if (data.exec) next.console = data.exec; // 계획/명령 스펙 표시
        break;
      }
      case 'executed': {
        next.toast = { type: 'success', text: data.message || '완료되었습니다.' };
        if (data.message) addBotMessage(data.message);
        if (data.exec && data.exec !== 'guide') onExpandFullRef.current?.();
        if (data.exec) next.console = data.exec; // 실행 결과 표시
        break;
      }
      case 'cancelled': {
        next.toast = { type: 'info', text: data.message || '사용자 취소' };
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
        break;
      }
      case 'low_confidence':
      case 'no_intent':
      default:
        // 보여줄 UI 없음
        break;
    }

    setUi(next);
  };

  // ───────────────────────── networking ─────────────────────────
  const postJson = async (url, payload) => {
    return axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  };

  // 기본(/) 호출 → Handle User Input (가이드/분기/플랜)
  const call = async (payload) => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}${ENDPOINT_BASE}/`; // POST /api/v1/userInputRe/
      const res = await postJson(url, payload);
      route(res.data);
      return res.data;
    } catch (e) {
      handleApiError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // suffix 지정 호출 → /continue, /confirm 등
  const callTo = async (suffix, payload) => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}${ENDPOINT_BASE}${suffix}`;
      const res = await postJson(url, payload);
      route(res.data);
      return res.data;
    } catch (e) {
      handleApiError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // 바로 실행 → /api/v1/userinput (스크립트 즉시 실행)
  const executeNow = async (text) => {
    const trimmed = String(text || '').trim();
    if (!trimmed) return;
    addMessage(trimmed, 'user');
    setLoading(true);
    try {
      const url = `${API_BASE_URL}${SIMPLE_EXEC_ENDPOINT}`; // POST /api/v1/userinput
      const res = await postJson(url, { text: trimmed, method: 'EXECUTION' });
      route(res.data); // status: executed | error | no_intent | unknown_method ...
      return res.data;
    } catch (e) {
      handleApiError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────── public API ─────────────────────────
  // 일반 전송 (GUIDE/EXECUTION) → 항상 "/" 로 보냄
  const send = ({ text, method = 'GUIDE', parameters = {} }) => {
    addMessage(text, 'user');
    lastUserTextRef.current = text; // EXECUTION 전환 대비 저장
    const payload = {
      text,
      method: String(method).toUpperCase(),
      parameters,
      interaction_id: interactionId,
    };
    return call(payload); // POST /api/v1/userInputRe/
  };

  // 편의: GUIDE 전송
  const sendGuide = (text) => send({ text, method: 'GUIDE' });

  // 편의: EXECUTION 전송(플랜 모드)
  const sendExecution = (text, parameters = {}) =>
    send({ text, method: 'EXECUTION', parameters });

  // GUIDE → EXECUTION 전환 (서버가 준 파라미터 유지)
  const goToExecution = () =>
    call({
      text: lastUserTextRef.current || '',
      method: 'EXECUTION',
      parameters: lastResponse?.parameters || {},
      interaction_id: interactionId,
    });

  // 누락 파라미터 제출 → "/continue"
  const submitMissingParams = (filled) => {
    if (!interactionId) {
      setUi((prev) => ({
        ...prev,
        toast: { type: 'error', text: '세션이 만료되었거나 없습니다. 처음부터 다시 시도하세요.' },
      }));
      return Promise.reject(new Error('No interaction_id for /continue'));
    }
    return callTo('/continue', {
      interaction_id: interactionId,
      parameters: { ...(lastResponse?.parameters || {}), ...filled },
      text: '',
      method: 'EXECUTION',
    });
  };

  // 확인 / 취소 → "/confirm"
  const confirmExecution = () => {
    if (!interactionId) {
      setUi((prev) => ({
        ...prev,
        toast: { type: 'error', text: '세션이 만료되었거나 없습니다. 처음부터 다시 시도하세요.' },
      }));
      return Promise.reject(new Error('No interaction_id for /confirm'));
    }
    return callTo('/confirm', { interaction_id: interactionId, confirm: true });
  };

  const cancelExecution = () => {
    if (!interactionId) {
      setUi((prev) => ({
        ...prev,
        toast: { type: 'error', text: '세션이 만료되었거나 없습니다. 처음부터 다시 시도하세요.' },
      }));
      return Promise.reject(new Error('No interaction_id for /confirm'));
    }
    return callTo('/confirm', { interaction_id: interactionId, confirm: false });
  };

  return {
    // state
    interactionId,
    lastResponse,
    loading,
    ui,
    messages,

    // message helpers
    addMessage,
    addBotMessage,
    addSystemMessage,

    // main actions
    send,            // "/" (GUIDE/EXECUTION 공용: 플랜)
    sendGuide,       // "/"
    sendExecution,   // "/"
    goToExecution,   // "/"

    // follow-ups
    submitMissingParams, // "/continue"
    confirmExecution,    // "/confirm"
    cancelExecution,     // "/confirm"

    // direct execution
    executeNow,          // "/api/v1/userinput" (실행)
  };
}
