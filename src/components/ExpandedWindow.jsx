import React from 'react';
import maximizeIcon from '../assets/checkbox.png';
import closeIcon from '../assets/close.png';
import '../css/ExpandedWindow.css';

function ExpandedWindow({ onClose, onExpandFull }) {
    return (
        <div className="expanded-window">
            <div className='header'>
                <img src={maximizeIcon} alt="Maximize" onClick={onExpandFull} />
                <img src={closeIcon} alt="Close" onClick={onClose} />
            </div>
            
            <div className='body'>
            <p>도움이 필요하신가요?</p>
        </div>
        <div className="chat-input-area">
            <input
            type="text"
            placeholder="질문을 입력하세요..."
            className="chat-input"
            />
            <button className="send-button">전송</button>
  </div>
        </div>
    ); 

}

export default ExpandedWindow;