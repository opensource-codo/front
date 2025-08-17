import React, { useState, useEffect } from 'react';
import axios from 'axios';
import minimizeIcon from '../assets/minimize.png';
import closeIcon from '../assets/close.png';
import arrowSubmit from '../assets/arrow-submit.png';
import codoIcon from '../assets/CODO_icon.png';
import '../css/FullExpandedWindow.css';

function FullExpandedWindow({ onMinimize, onClose }) {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        { from: 'system', text: '안녕하세요! 무엇을 도와드릴까요?' }
    ]);

    const [activeMenu, setActiveMenu] = useState('home'); // 활성 메뉴 상태 추가
    const [frequentFunctions, setFrequentFunctions] = useState([]);
    const [recentFunctions, setRecentFunctions] = useState([]);
    const [loading, setLoading] = useState(false);

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
        setMessages([
            { from: 'system', text: '안녕하세요! 무엇을 도와드릴까요?' }
        ]);
        setInputText('');
        setActiveMenu('home'); // 홈 메뉴 활성화
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        setMessages(prev => [...prev, { from: 'user', text: inputText }]);
        setInputText('');

        // 여기에 실제 API 호출 로직을 추가할 수 있습니다
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { from: 'bot', text: '메시지를 받았습니다. 곧 응답하겠습니다.' }
            ]);
        }, 1000);
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputText(suggestion);
    };

    return (
        <div className='full-expanded-window'>
            <aside className='sidebar'>
                <div className='logo' onClick={goHome} style={{ cursor: 'pointer' }}>
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
                    <button 
                        className={`menu-item ${activeMenu === 'home' ? 'active' : ''}`}
                        onClick={goHome}
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
                
                <div className='body'>
                    {activeMenu === 'home' ? (
                        <>
                            {messages.map((m, i) => (
                                <div key={i} className={`message ${m.from}`}>
                                    {m.text}
                                </div>
                            ))}

                            <div className='input-container'>
                                <div className='input-top'>
                                    <input 
                                        type='text' 
                                        placeholder='질문을 입력하세요..' 
                                        className='input-field'
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={onKeyDown}
                                    />
                                    <button className="send-button" onClick={() => sendMessage()}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        전송
                                    </button>
                                </div>

                                <div className='suggestions-buttons'>
                                    <button onClick={() => handleSuggestionClick('단축키 안내')}>
                                        ⌨️ 단축키 안내
                                    </button>
                                    <button onClick={() => handleSuggestionClick('자동 실행')}>
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

export default FullExpandedWindow;