import React, { useState } from 'react';
import CompactWindow from './components/CompactWindow';
import ExpandedWindow from './components/ExpandedWindow';
import FullExpandedWindow from './components/FullExpandedWindow';
import GoogleLoginButton from './components/GoogleLoginButton';
import './css/App.css';

function App() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [windowSize, setWindowSize] = useState('compact');
  // 'compact', 'expanded', 'full' 중 하나로 

  if (!isAuthed) {
    //로그인 전 - 구글 로그인 버튼만 노출
     return(
     <div
      style={{
        height: '50vh',
        display: 'grid',
        flexDirection: 'column',
        placeItems: 'center',
        background: '#ffffff',  
        alignItems: 'center',   
        gap: '5px',
      }}
    >

      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
          <img
            src={require('./assets/CODO_icon.png')}
            alt="Codo"
            style={{ width: 74, height: 74, objectFit: 'contain' }}
          />

        </div>


      <GoogleLoginButton
        onAuthed={() => {
          setIsAuthed(true);
          setWindowSize('expanded');
        }}
      />
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
          onClose={() => setWindowSize('compact')}
          onExpandFull={() => setWindowSize('full')}
        />
      )}
      {windowSize === 'full' && (
        <FullExpandedWindow
          onMinimize={() => setWindowSize('expanded')}
          onClose={() => setWindowSize('compact')}
        />
      )}
    </div>
  );
}

export default App;
