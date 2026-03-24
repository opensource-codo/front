import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import minimizeIcon from '../assets/minimize.png';
import closeIcon from '../assets/close.png';
import codoIcon from '../assets/CODO_icon.png';
import '../css/FullExpandedWindow.css';
import useGuideHistory from '../hooks/useGuideHistory';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

function FullExpandedWindow({ agent, onMinimize, onClose }) {
    const [inputText, setInputText] = useState('');
    const [mode, setMode] = useState('GUIDE');
    const [activeMenu, setActiveMenu] = useState('home');
    const [frequentFunctions, setFrequentFunctions] = useState([]);
    const [recentFunctions, setRecentFunctions] = useState([]);
    const [loading, setLoading] = useState(false);

    const bodyRef = useRef(null);

    const {
        ui, loading: agentLoading, messages,
        send, goToExecution, submitMissingParams,
        confirmExecution, cancelExecution
    } = agent;

    const guideHistory = useGuideHistory(ui);

    useEffect(() => {
        bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, ui, agentLoading, guideHistory]);

    const fetchFrequentFunctions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/v1/frequent-functions`);
            setFrequentFunctions(response.data);
        } catch (error) {
            console.error('자주 쓰는 기능을 가져오는데 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentFunctions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/api/v1/recent-functions`);
            setRecentFunctions(response.data);
        } catch (error) {
            console.error('최근 쓴 기능을 가져오는데 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFrequentMenuClick = () => {
        setActiveMenu('frequent');
        fetchFrequentFunctions();
        fetchRecentFunctions();
    };

    const sendMessage = async (method = mode, overrideText) => {
        const text = (overrideText ?? inputText).trim();
        if (!text || agentLoading) return;
        setInputText('');
        await send({ text, method });
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
                    <button
                        className={`menu-item ${activeMenu === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('settings')}
                    >
                        ⚙️ 설정
                    </button>
                    <button
                        className={`menu-item ${activeMenu === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveMenu('home')}
                    >
                        🏠 홈
                    </button>
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
                            <ChatBody
                                messages={messages}
                                guideHistory={guideHistory}
                                ui={ui}
                                loading={agentLoading}
                                onGoToExecution={goToExecution}
                                onSubmitMissing={submitMissingParams}
                                onConfirm={confirmExecution}
                                onCancel={cancelExecution}
                            />

                            <div className='input-container'>
                                <ChatInput
                                    value={inputText}
                                    onChange={setInputText}
                                    onSend={sendMessage}
                                    mode={mode}
                                    onModeChange={setMode}
                                    disabled={agentLoading}
                                />
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

export default FullExpandedWindow;
