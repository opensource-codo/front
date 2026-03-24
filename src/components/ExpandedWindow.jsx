import React, { useState, useRef, useEffect } from 'react';
import maximizeIcon from '../assets/checkbox.png';
import closeIcon from '../assets/close.png';
import '../css/ExpandedWindow.css';
import useGuideHistory from '../hooks/useGuideHistory';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';

function ExpandedWindow({ agent, onClose, onExpandFull }) {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('GUIDE');
  const bodyRef = useRef(null);

  const {
    ui, loading, messages,
    send, goToExecution, submitMissingParams,
    confirmExecution, cancelExecution
  } = agent;

  const guideHistory = useGuideHistory(ui);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, ui, loading, guideHistory]);

  const sendMessage = async (method = mode, overrideText) => {
    const text = (overrideText ?? inputText).trim();
    if (!text || loading) return;
    setInputText('');
    await send({ text, method });
  };

  return (
    <div className="expanded-window">
      <div className="header">
        <img src={maximizeIcon} alt="Maximize" onClick={onExpandFull} aria-label="창 최대화" role="button" />
        <img src={closeIcon} alt="Close" onClick={onClose} aria-label="창 닫기" role="button" />
      </div>

      <div className="body" ref={bodyRef}>
        <ChatBody
          messages={messages}
          guideHistory={guideHistory}
          ui={ui}
          loading={loading}
          onGoToExecution={goToExecution}
          onSubmitMissing={submitMissingParams}
          onConfirm={confirmExecution}
          onCancel={cancelExecution}
        />
      </div>

      <ChatInput
        value={inputText}
        onChange={setInputText}
        onSend={sendMessage}
        mode={mode}
        onModeChange={setMode}
        disabled={loading}
      />
    </div>
  );
}

export default ExpandedWindow;
