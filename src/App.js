import React, { useState } from 'react';
import CompactWindow from './components/CompactWindow';
import ExpandedWindow from './components/ExpandedWindow';
import FullExpandedWindow from './components/FullExpandedWindow';
import './css/App.css';

function App() {
  const [windowSize, setWindowSize] = useState('compact');
  // 'compact', 'expanded', 'full' 중 하나로 

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
