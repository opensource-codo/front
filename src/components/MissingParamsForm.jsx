import { useState } from 'react';
import styles from '../css/Chat.module.css';

/** 스키마를 읽어 동적으로 필수 파라미터 입력 폼 생성 */
function MissingParamsForm({ schema, required, onSubmit }) {
  const [form, setForm] = useState({});
  if (!schema || !required?.length) return null;

  return (
    <div className={styles.card}>
      <b>추가 입력이 필요합니다</b>
      <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
        {schema.required?.filter(r => required.includes(r.name)).map((r) => (
          <label key={r.name} className={styles.field}>
            <span className={styles.label}>{r.name} <small>({r.type})</small></span>
            <input
              className={styles.missingInput}
              placeholder={r.description || `${r.name} 입력`}
              onChange={(e) => setForm(prev => ({ ...prev, [r.name]: e.target.value }))}
            />
          </label>
        ))}
      </div>
      <button className={styles.sendButton} style={{ marginTop: 10 }} onClick={() => onSubmit(form)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 2L16 22L12 13L3 9L23 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        누락값 제출
      </button>
    </div>
  );
}

export default MissingParamsForm;
