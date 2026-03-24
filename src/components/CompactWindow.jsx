import React from 'react';
import codoButton from '../assets/CODO_icon.png';
import '../css/App.css';

function CompactWindow({ onExpand }){
    return (
        <div className="compact-window">
            <div className="compact-button-container">
                <img
                    src={codoButton}
                    alt="도움요청버튼"
                    className="compact-icon"
                    onClick={onExpand}
                />
                <div className="pulse-indicator"></div>
            </div>
        </div>
    );
}

export default CompactWindow;