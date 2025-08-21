// src/components/AgentChat.jsx
import { useState } from 'react';
import useAgent from '../hooks/useAgent'; // 방금 수정한 훅 경로

export default function AgentChat() {
  const [text, setText] = useState('');
  const {
    ui, messages, loading,
    send, goToExecution, submitMissingParams,
    confirmExecution, cancelExecution,
  } = useAgent({
    onExpandFull: () => console.log('🔎 확장 보기 트리거'),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await send({ text, method: 'GUIDE' });
    setText('');
  };

  return (
    <div style={{maxWidth: 720, margin: '20px auto', padding: 16, border: '1px solid #eee', borderRadius: 12}}>
      <h3>도우미</h3>

      {/* 메시지 히스토리 */}
      <div style={{height: 300, overflowY: 'auto', padding: 8, border: '1px solid #ddd', borderRadius: 8, marginBottom: 12}}>
        {messages.map(m => (
          <div key={m.id} style={{margin: '8px 0'}}>
            <b>[{m.type}]</b> {m.text}
          </div>
        ))}
      </div>

      {/* guide 완료 시: 실행 버튼 */}
      {ui.guide && (
        <div style={{background: '#fafafa', padding: 12, borderRadius: 8, marginBottom: 12}}>
          <div>🔎 안내 완료</div>
          {ui.guide?.shortcut && <div>단축키: <code>{ui.guide.shortcut}</code></div>}
          <button onClick={goToExecution} disabled={loading} style={{marginTop: 8}}>
            이대로 실행하기
          </button>
        </div>
      )}

      {/* 누락 파라미터 폼 */}
      {ui.missing && (
        <MissingParamsForm
          schema={ui.missing.schema}
          required={ui.missing.required}
          onSubmit={(filled) => submitMissingParams(filled)}
          submitting={loading}
        />
      )}

      {/* 실행 전 확인 모달(간단 버전) */}
      {ui.confirm && (
        <div style={{padding: 12, border: '1px solid #f0ad4e', borderRadius: 8, marginBottom: 12}}>
          <div style={{marginBottom: 8}}>⚠️ 아래 작업을 실행할까요?</div>
          <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(ui.confirm, null, 2)}</pre>
          <button onClick={confirmExecution} disabled={loading} style={{marginRight: 8}}>확인</button>
          <button onClick={cancelExecution} disabled={loading}>취소</button>
        </div>
      )}

      {/* 에러/토스트 간단 표시 */}
      {ui.error && (
        <div style={{color: 'white', background: '#d9534f', padding: 8, borderRadius: 6, marginBottom: 8}}>
          오류: {ui.error.message}
        </div>
      )}
      {ui.toast && (
        <div style={{color: '#333', background: '#f7f7f7', padding: 8, borderRadius: 6, marginBottom: 8}}>
          {ui.toast.text}
        </div>
      )}

      {/* 입력창 */}
      <form onSubmit={onSubmit} style={{display: 'flex', gap: 8}}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="무엇을 도와드릴까요?"
          style={{flex: 1, padding: 8}}
        />
        <button type="submit" disabled={loading}>전송</button>
      </form>
    </div>
  );
}

// ── 누락 파라미터 폼: ParameterSchema 기반 자동 렌더 ──
function MissingParamsForm({ schema, required = [], onSubmit, submitting }) {
  const [form, setForm] = useState({});

  const fields = [
    ...(schema?.required || []),
    ...(schema?.optional || []),
  ];

  const setVal = (name, val) => setForm(prev => ({...prev, [name]: val}));

  return (
    <div style={{background: '#fffbe6', padding: 12, borderRadius: 8, marginBottom: 12}}>
      <div style={{marginBottom: 6}}>ℹ️ 필요한 정보가 더 있어요.</div>
      {fields.length === 0 && <div>필요한 항목이 없습니다.</div>}
      {fields.map(f => (
        <div key={f.name} style={{marginBottom: 8}}>
          <label>
            {f.name} {required?.includes(f.name) ? <b style={{color: 'crimson'}}>*</b> : null}
          </label>
          <div>
            {Array.isArray(f.choices) && f.choices.length > 0 ? (
              <select onChange={e => setVal(f.name, e.target.value)}>
                <option value="">선택하세요</option>
                {f.choices.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : f.type === 'bool' ? (
              <input type="checkbox" onChange={e => setVal(f.name, e.target.checked)} />
            ) : (
              <input type="text" onChange={e => setVal(f.name, e.target.value)} placeholder={f.description || ''} />
            )}
          </div>
        </div>
      ))}
      <button onClick={() => onSubmit(form)} disabled={submitting}>제출</button>
    </div>
  );
}
