import React, { useState } from 'react';
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
                <div className='logo'>
                    <img src={codoIcon} alt="CODO Icon" className="logo-icon" />
                    CODO
                </div>

                <nav className='menu'>
                    <button className='menu-item active'>📌 자주 쓰는 기능</button>
                    <button className='menu-item'>⚙️ 설정</button>
                    <button className='menu-item'>🏠 홈</button>
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
                    <p>안녕하세요! 무엇을 도와드릴까요?</p>

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
                            <button className='submit-button' onClick={sendMessage}>
                                <img src={arrowSubmit} alt='Submit' />
                            </button>
                        </div>

                        <div className='suggestions-buttons'>
                            <button onClick={() => handleSuggestionClick('단축키 안내')}>
                                ⌨️ 단축키 안내
                            </button>
                            <button onClick={() => handleSuggestionClick('시뮬레이션')}>
                                🎮 시뮬레이션
                            </button>
                            <button onClick={() => handleSuggestionClick('자동 실행')}>
                                ⚡ 자동 실행
                            </button>
                        </div>
                    </div>

                    {messages.length > 1 && (
                        <div className='messages-container'>
                            {messages.slice(1).map((message, index) => (
                                <div key={index} className={`message ${message.from}`}>
                                    {message.text}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FullExpandedWindow;