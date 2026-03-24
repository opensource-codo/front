import { useState, useEffect, useRef } from 'react';
import minimizeIcon from '../assets/minimize.png';
import closeIcon from '../assets/close.png';
import codoIcon from '../assets/CODO_icon.png';
import styles from '../css/FullExpandedWindow.module.css';
import useGuideHistory from '../hooks/useGuideHistory';
import useFunctions from '../hooks/useFunctions';
import HomeView from './views/HomeView';
import FrequentView from './views/FrequentView';
import SettingsView from './views/SettingsView';

function FullExpandedWindow({ agent, onMinimize, onClose, userInfo }) {
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
        <div className={styles.fullExpandedWindow}>
            <aside className={styles.sidebar}>
                <div className={styles.logo} onClick={onClose} style={{ cursor: 'pointer' }}>
                    <img src={codoIcon} alt="CODO Icon" className={styles.logoIcon} />
                    CODO
                </div>

                <nav className={styles.menu}>
                    <button
                        className={`${styles.menuItem} ${activeMenu === 'frequent' ? styles.active : ''}`}
                        onClick={handleFrequentMenuClick}
                    >
                        📌 자주 쓰는 기능
                    </button>
                    <button
                        className={`${styles.menuItem} ${activeMenu === 'settings' ? styles.active : ''}`}
                        onClick={() => setActiveMenu('settings')}
                    >
                        ⚙️ 설정
                    </button>
                    <button
                        className={`${styles.menuItem} ${activeMenu === 'home' ? styles.active : ''}`}
                        onClick={() => setActiveMenu('home')}
                    >
                        🏠 홈
                    </button>
                </nav>

                <div className={styles.spacer} />

                <div className={styles.userProfile}>
                    {userInfo?.picture
                        ? <img src={userInfo.picture} alt="프로필" className={styles.avatar} />
                        : <div className={styles.avatar} />
                    }
                    <div className={styles.username}>{userInfo?.name ?? '사용자'}</div>
                </div>
            </aside>

            <div className={styles.mainContent}>
                <div className={styles.fewHeader}>
                    <img src={minimizeIcon} alt="Minimize" onClick={onMinimize} />
                    <img src={closeIcon} alt="Close" onClick={onClose} />
                </div>

                <div className={styles.fewBody} ref={bodyRef}>
                    {renderView()}
                </div>
            </div>
        </div>
    );
}

export default FullExpandedWindow;
