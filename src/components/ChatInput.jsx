import styles from '../css/Chat.module.css';

function ChatInput({ value, onChange, onSend, mode, onModeChange, disabled }) {
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(mode);
    }
  };

  return (
    <>
      <div className={styles.chatInputArea}>
        <input
          type="text"
          placeholder="질문을 입력하세요..."
          className={styles.chatInput}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
        <button className={styles.sendButton} onClick={() => onSend(mode)} disabled={disabled}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          전송
        </button>
      </div>

      <div className={styles.suggestionButtons}>
        <button
          onClick={() => onModeChange('GUIDE')}
          className={`${styles.suggestionButton} ${mode === 'GUIDE' ? styles.active : ''}`}
          aria-pressed={mode === 'GUIDE'}
          disabled={disabled}
        >
          ⌨️ 단축키 안내
        </button>
        <button
          onClick={() => onModeChange('EXECUTION')}
          className={`${styles.suggestionButton} ${mode === 'EXECUTION' ? styles.active : ''}`}
          aria-pressed={mode === 'EXECUTION'}
          disabled={disabled}
        >
          ⚡ 자동 실행
        </button>
      </div>
    </>
  );
}

export default ChatInput;
