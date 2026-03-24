import React, { useState, useEffect, useRef } from 'react';
import minimizeIcon from '../assets/minimize.png';
import closeIcon from '../assets/close.png';
import codoIcon from '../assets/CODO_icon.png';
import '../css/FullExpandedWindow.css';
import useGuideHistory from '../hooks/useGuideHistory';
import useFunctions from '../hooks/useFunctions';
import HomeView from './views/HomeView';
import FrequentView from './views/FrequentView';
import SettingsView from './views/SettingsView';

function FullExpandedWindow({ agent, onMinimize, onClose }) {
    const [inputText, setInputText] = useState('');
    const [mode, setMode] = useState('GUIDE');
    const [activeMenu, setActiveMenu] = useState('home');

    const { frequentFunctions, recentFunctions, loading, fetchAll } = useFunctions();

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

    const handleFrequentMenuClick = () => {
        setActiveMenu('frequent');
        fetchAll();
    };

    const sendMessage = async (method = mode, overrideText) => {
        const text = (overrideText ?? inputText).trim();
        if (!text || agentLoading) return;
        setInputText('');
        await send({ text, method });
    };

    const renderView = () => {
        switch (activeMenu) {
            case 'frequent':
                return (
                    <FrequentView
                        frequentFunctions={frequentFunctions}
                        recentFunctions={recentFunctions}
                        loading={loading}
                    />
                );
            case 'settings':
                return <SettingsView />;
            default:
                return (
                    <HomeView
                        messages={messages}
                        guideHistory={guideHistory}
                        ui={ui}
                        agentLoading={agentLoading}
                        goToExecution={goToExecution}
                        submitMissingParams={submitMissingParams}
                        confirmExecution={confirmExecution}
                        cancelExecution={cancelExecution}
                        inputText={inputText}
                        setInputText={setInputText}
                        sendMessage={sendMessage}
                        mode={mode}
                        setMode={setMode}
                    />
                );
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
                <div className='few-header'>
                    <img src={minimizeIcon} alt="Minimize" onClick={onMinimize} />
                    <img src={closeIcon} alt="Close" onClick={onClose} />
                </div>

                <div className='few-body' ref={bodyRef}>
                    {renderView()}
                </div>
            </div>
        </div>
    );
}

export default FullExpandedWindow;
