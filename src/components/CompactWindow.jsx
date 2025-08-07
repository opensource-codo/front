import React from 'react';
import codoButton from '../assets/CODO_icon.png'

function CompactWindow({ onExpand }){
    return (
        <div className="compact-window">
            <div className="compact-button-container">
                <img 
                    src={codoButton}
                    alt="도움요청버튼"
                    onClick={onExpand}
                    style={{
                        cursor: 'pointer',
                        width: '120px',
                        height: 'auto',
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.filter = 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2))';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))';
                    }}
                />
                <div className="pulse-indicator"></div>
            </div>
        </div>
    );
}

export default CompactWindow;