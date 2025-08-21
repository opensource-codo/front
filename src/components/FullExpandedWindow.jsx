import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import minimizeIcon from '../assets/minimize.png';
import closeIcon from '../assets/close.png';
import arrowSubmit from '../assets/arrow-submit.png';
import codoIcon from '../assets/CODO_icon.png';
import '../css/FullExpandedWindow.css';
import useAgent from '../hooks/useAgent';

function FullExpandedWindow({ agent, onMinimize, onClose }) {
    const [inputText, setInputText] = useState('');
    const [mode, setMode] = useState('GUIDE'); 

    const [activeMenu, setActiveMenu] = useState('home'); // 활성 메뉴 상태 추가
    const [frequentFunctions, setFrequentFunctions] = useState([]);
    const [recentFunctions, setRecentFunctions] = useState([]);
    const [loading, setLoading] = useState(false);

    const bodyRef = useRef(null);

    // agent prop에서 필요한 값들을 가져오기
    const {
        ui, loading: agentLoading, messages,
        send, goToExecution, submitMissingParams,
        confirmExecution, cancelExecution
    } = agent;

    useEffect(() => {
        bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, ui, agentLoading]);

    // 자주 쓰는 기능 데이터 가져오기
    const fetchFrequentFunctions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/v1/frequent-functions');
            setFrequentFunctions(response.data);
        } catch (error) {
            console.error('자주 쓰는 기능을 가져오는데 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    // 최근 쓴 기능 데이터 가져오기
    const fetchRecentFunctions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/v1/recent-functions');
            setRecentFunctions(response.data);
        } catch (error) {
            console.error('최근 쓴 기능을 가져오는데 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    // 자주 쓰는 기능 메뉴 클릭 처리
    const handleFrequentMenuClick = () => {
        setActiveMenu('frequent');
        fetchFrequentFunctions();
        fetchRecentFunctions();
    };

    // 홈으로 돌아가는 함수
    const goHome = () => {
        // setMessages([ // This line was removed as per the edit hint
        //     { from: 'system', text: '안녕하세요! 무엇을 도와드릴까요?' }
        // ]);
        setInputText('');
        setActiveMenu('home'); // 홈 메뉴 활성화
    };

    const sendMessage = async (method = mode, overrideText) => {
        const text = (overrideText ?? inputText).trim();
        if (!text || agentLoading) return;

        setInputText('');

        // 서버 호출 (useAgent의 send에서 자동으로 메시지 추가됨)
        await send({ text, method });
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(mode);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        if (suggestion === '단축키 안내') {
            setMode('GUIDE');
        } else if (suggestion === '자동 실행') {
            setMode('EXECUTION');
        } else {
            setInputText(suggestion);
        }
    };

    return (
        <div className='full-expanded-window'>
            <aside className='sidebar'>
                <div className='logo' onClick={onClose} style={{ cursor: 'pointer' }}>
                    <img src={codoIcon} alt="CODO Icon" className="logo-icon" />
                    CODO
                </div>

                <nav className='menu'>
                    <button 
                        className={`menu-item ${activeMenu === 'frequent' ? 'active' : ''}`}
                        onClick={handleFrequentMenuClick}
                    >
                        📌 자주 쓰는 기능
                    </button>
                    <button className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}>⚙️ 설정</button>
                    <button className={`menu-item ${activeMenu === 'home' ? 'active' : ''}`}>🏠 홈</button>
                </nav>

                <div className="spacer" />

                <div className='user-profile'>
                    <div className='avatar'></div>
                    <div className='username'>사용자</div>
                </div>
            </aside>

            <div className='main-content'>
                <div className='header'>
                    <img src={minimizeIcon} alt="Minimize" onClick={onMinimize} />
                    <img src={closeIcon} alt="Close" onClick={onClose} />
                </div>
                
                <div className='body' ref={bodyRef}>
                    {activeMenu === 'home' ? (
                        <>
                            {messages.map((m) => (
                                <div key={m.id} className={`message ${m.type}`}>
                                    {m.text}
                                </div>
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
                                                // setMessages(prev => [...prev, { from:'bot', text: data?.message || '(메시지 없음)' }]); // This line was removed as per the edit hint
                                            }}>확인</button>
                                            <button className="secondary-button" onClick={async () => {
                                                const data = await cancelExecution();
                                                // setMessages(prev => [...prev, { from:'bot', text: data?.message || '(메시지 없음)' }]); // This line was removed as per the edit hint
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
                            {agentLoading && <div className="loading">처리 중...</div>}

                            <div className='input-container'>
                                <div className='input-top'>
                                    <input 
                                        type='text' 
                                        placeholder='질문을 입력하세요..' 
                                        className='input-field'
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={onKeyDown}
                                        disabled={agentLoading}
                                    />
                                    <button className="send-button" onClick={() => sendMessage(mode)} disabled={agentLoading}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        전송
                                    </button>
                                </div>

                                <div className='suggestions-buttons'>
                                    <button onClick={() => handleSuggestionClick('단축키 안내')} 
                                    className={`${mode === 'GUIDE' ? 'active' : ''}`} 
                                    aria-pressed={mode === 'GUIDE'} disabled={agentLoading} >
                                        ⌨️ 단축키 안내
                                    </button>
                                    <button
                                        onClick={() => handleSuggestionClick('자동 실행')}
                                        className={`suggestions-button ${mode === 'EXECUTION' ? 'active' : ''}`}
                                        aria-pressed={mode === 'EXECUTION'}
                                        disabled={agentLoading}
                                    >
                                        ⚡ 자동 실행
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : activeMenu === 'frequent' ? (
                        <div className='frequent-functions-container'>
                            <h2>자주 쓰는 기능</h2>
                            
                            {loading ? (
                                <div className='loading'>로딩 중...</div>
                            ) : (
                                <>
                                    <div className='frequent-functions-grid'>
                                        {frequentFunctions.map((func, index) => (
                                            <div key={index} className='function-card'>
                                                <div className='function-icon'>{func.icon}</div>
                                                <div className='function-title'>{func.title}</div>
                                                <div className='function-description'>{func.description}</div>
                                                <div className='function-shortcut'>{func.shortcut}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='recent-functions-section'>
                                        <h3>최근 쓴 기능들</h3>
                                        <p className='subtitle'>가장 최근에 한 질문들</p>
                                        
                                        <div className='recent-functions-list'>
                                            {recentFunctions.map((func, index) => (
                                                <div key={index} className='recent-function-item'>
                                                    <div className='recent-function-title'>{func.title}</div>
                                                    <div className='recent-function-time'>{func.time}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className='settings-container'>
                            <h2>설정</h2>
                            <p>설정 화면이 여기에 표시됩니다.</p>
                        </div>
                    )}
                </div>
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

export default FullExpandedWindow;