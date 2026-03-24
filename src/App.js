import React, { useEffect, useState } from 'react';
import CompactWindow from './components/CompactWindow';
import ExpandedWindow from './components/ExpandedWindow';
import FullExpandedWindow from './components/FullExpandedWindow';
import GoogleLoginButton from './components/GoogleLoginButton';
import useAgent from './hooks/useAgent';
import './css/App.css';

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [windowSize, setWindowSize] = useState('compact');
  // 'compact', 'expanded', 'full' 중 하나로 

  // useAgent를 App 레벨에서 관리하여 메시지 공유
  const agent = useAgent({ 
    onExpandFull: () => setWindowSize('full') 
  });

  useEffect(() => {
    const flag = localStorage.getItem('authed') === '1';
    if (flag) {
      setIsAuthed(true);
      setWindowSize('expanded'); // compact 대신 expanded로 설정
    }
  }, []);

  // GoogleLoginButton에서 성공 시 호출할 핸들러
  const handleAuthed = () => {
    localStorage.setItem('authed', '1'); // 새로고침에도 유지
    setIsAuthed(true);
    setWindowSize('expanded'); // compact 대신 expanded로 설정
  };


  if (!isAuthed) {
    //로그인 전 - 구글 로그인 버튼만 노출
     return(
     <div
      style={{
        height: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#ffffff',  
        gap: '16px', // 간격을 16px로 조정
      }}
    >

      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 0 }}>
          <img
            src={require('./assets/CODO_icon.png')}
            alt="Codo"
            style={{ width: 74, height: 74, objectFit: 'contain' }}
          />
        </div>

      <GoogleLoginButton onAuthed={handleAuthed} />
    </div>
  );
}



  return (
    <div className="app-container">
      {windowSize === 'compact' && (
        <CompactWindow onExpand={() => setWindowSize('expanded')} />
      )}
      {windowSize === 'expanded' && (
        <ExpandedWindow
          agent={agent}
          onClose={() => setWindowSize('compact')}
          onExpandFull={() => setWindowSize('full')}
        />
      )}
      {windowSize === 'full' && (
        <FullExpandedWindow
          agent={agent}
          onMinimize={() => setWindowSize('expanded')}
          onClose={() => setWindowSize('compact')}
        />
      )}
    </div>
  );
}

export default App;
