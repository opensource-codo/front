import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import maximizeIcon from '../assets/checkbox.png';
import closeIcon from '../assets/close.png';
import '../css/ExpandedWindow.css';
import useAgent from '../hooks/useAgent';

function ExpandedWindow({ agent, onClose, onExpandFull }) {
  
  //상태 선언 
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('GUIDE');
  const bodyRef = useRef(null);

  // agent prop에서 필요한 값들을 가져오기
  const {
    ui, loading, messages,
    send, goToExecution, submitMissingParams,
    confirmExecution,cancelExecution
  } = agent;

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, ui, loading]);


  //전송 함수
  const sendMessage = async (method = mode, overrideText) => {

    const text = (overrideText ?? inputText).trim();
    if (!text || loading) return;

    setInputText('');


    //서버 호출 (useAgent의 send에서 자동으로 메시지 추가됨)
    await send({ text, method });
  };

  // Enter = 전송, Shift+Enter = 줄바꿈
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(mode);
    }
  };

   // "단축키 안내" / "자동 실행" 버튼
  const handleShortcutGuide = (suggestion) => {
      setMode('GUIDE');
    
  };

  const handleAutoExecution = () => {
    setMode('EXECUTION');
  };

  return (
    <div className="expanded-window">
      <div className="header">
        <img src={maximizeIcon} alt="Maximize" onClick={onExpandFull} aria-label="창 최대화" role="button" />
        <img src={closeIcon} alt="Close" onClick={onClose} aria-label="창 닫기" role="button" />
      </div>

      <div className="body" ref={bodyRef}>
        {/* 채팅 말풍선 */}
        {messages.map((m) => (
          <div key={m.id} className={`message ${m.type}`}>{m.text}</div>
        ))}

        {/* GUIDE 카드 */}
        {ui.guide && (
          <div className="card">
            <div style={{ marginBottom: 6 }}>
              <b>단축키:</b> {ui.guide.shortcut || '-'}
            </div>
            <button className="send-button" onClick={goToExecution}>
              실행으로 전환
            </button>
          </div>
        )}

        {/* 누락 파라미터 폼 */}
        {ui.missing && (
          <MissingParamsForm
            schema={ui.missing.schema}
            required={ui.missing.required}
            onSubmit={async (filled) => {
              const data = await submitMissingParams(filled);
            
            }}
          />
        )}

        {/* 확인 모달 */}
        {ui.confirm && (
          <div className="modal">
            <div className="modal-content">
              <h4>실행 확인</h4>
              <pre className="code-block">{JSON.stringify(ui.confirm, null, 2)}</pre>
              <div className="modal-actions">
                <button className="send-button" onClick={async () => {
                  const data = await confirmExecution();
                }}>확인</button>
                <button className="secondary-button" onClick={async () => {
                  const data = await cancelExecution();
                }}>취소</button>
              </div>
            </div>
          </div>
        )}

        {/* 실패/토스트/로딩 */}
        {ui.error && (
          <div className="error-card">
            <div style={{ fontWeight: 600 }}>{ui.error.message}</div>
            {ui.error.details?.length > 0 && (
              <pre className="code-block">{JSON.stringify(ui.error.details, null, 2)}</pre>
            )}
          </div>
        )}

        {ui.toast && <div className={`toast ${ui.toast.type}`}>{ui.toast.text}</div>}
        {loading && <div className="loading">처리 중...</div>}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="질문을 입력하세요..."
          className="chat-input"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={loading}
        />
        <button className="send-button" onClick={() => sendMessage('GUIDE')} disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          전송
        </button>
      </div>

      <div className="suggestion-buttons">
        <button
          onClick={handleShortcutGuide}
          className={`suggestion-button ${mode === 'GUIDE' ? 'active' : ''}`}
          aria-pressed={mode === 'GUIDE'}
          disabled={loading}            
        >
          ⌨️ 단축키 안내
        </button>

        <button
          onClick={handleAutoExecution}
          className={`suggestion-button ${mode === 'EXECUTION' ? 'active' : ''}`}
          aria-pressed={mode === 'EXECUTION'}
          disabled={loading}
        >
          ⚡ 자동 실행
        </button>
      </div>
    </div>
  );
}

/** 스키마를 읽어 동적으로 필수 파라미터 입력 폼 생성 */
function MissingParamsForm({ schema, required, onSubmit }) {
  const [form, setForm] = useState({});
  if (!schema || !required?.length) return null;

  return (
    <div className="card">
      <b>추가 입력이 필요합니다</b>
      <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
        {schema.required?.filter(r => required.includes(r.name)).map((r) => (
          <label key={r.name} className="field">
            <span className="label">{r.name} <small>({r.type})</small></span>
            <input
              className="missing-input"
              placeholder={r.description || `${r.name} 입력`}
              onChange={(e) => setForm(prev => ({ ...prev, [r.name]: e.target.value }))}
            />
          </label>
        ))}
      </div>
      <button className="send-button" style={{ marginTop: 10 }} onClick={() => onSubmit(form)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L16 22L12 13L3 9L23 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        누락값 제출
      </button>
    </div>
  );
}

export default ExpandedWindow;