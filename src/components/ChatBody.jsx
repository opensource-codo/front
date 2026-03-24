import React from 'react';
import styles from '../css/Chat.module.css';
import MissingParamsForm from './MissingParamsForm';

function ChatBody({
  messages,
  guideHistory,
  ui,
  loading,
  onGoToExecution,
  onSubmitMissing,
  onConfirm,
  onCancel,
  variant,
}) {
  const msgBase = variant === 'few'
    ? `${styles.message} ${styles.messageFew}`
    : styles.message;

  return (
    <>
      {/* 채팅 말풍선 */}
      {messages.map((m) => (
        <div key={m.id} className={`${msgBase} ${styles[m.type] || ''}`}>{m.text}</div>
      ))}

      {/* GUIDE 카드 */}
      {guideHistory.map((g) => (
        <div key={g.id} className={`${msgBase} ${styles.guide}`}>
          <div style={{ marginBottom: 6, fontWeight: 600 }}>
            단축키: {g.shortcut}
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{g.text}</div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <button className={styles.sendButton} onClick={onGoToExecution}>실행으로 전환</button>
          </div>
        </div>
      ))}

      {/* 누락 파라미터 폼 */}
      {ui.missing && (
        <MissingParamsForm
          schema={ui.missing.schema}
          required={ui.missing.required}
          onSubmit={onSubmitMissing}
        />
      )}

      {/* 확인 모달 */}
      {ui.confirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>실행 확인</h4>
            <pre className={styles.codeBlock}>{JSON.stringify(ui.confirm, null, 2)}</pre>
            <div className={styles.modalActions}>
              <button className={styles.sendButton} onClick={onConfirm}>확인</button>
              <button className={styles.secondaryButton} onClick={onCancel}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 실패/토스트/로딩 */}
      {ui.error && (
        <div className={styles.errorCard}>
          <div style={{ fontWeight: 600 }}>{ui.error.message}</div>
          {ui.error.details?.length > 0 && (
            <pre className={styles.codeBlock}>{JSON.stringify(ui.error.details, null, 2)}</pre>
          )}
        </div>
      )}

      {ui.toast && (
        <div className={`${styles.toast} ${styles[ui.toast.type] || ''}`}>{ui.toast.text}</div>
      )}
      {loading && <div className={styles.loading}>처리 중...</div>}
    </>
  );
}

export default ChatBody;
