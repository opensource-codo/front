import React from 'react';
import minimizeIcon from '../assets/minimize.png';
import closeIcon from '../assets/close.png';
import arrowSubmit from '../assets/arrow-submit.png';
import '../css/FullExpandedWindow.css';

function FullExpandedWindow({ onMinimize, onClose }) {
    return (
        <div className='full-expanded-window'>
            <aside className='sidebar'>
                <div className='logo'>Codo AI</div>

                <nav className='menu'>
                    <button className='menu-item active'>📌자주 쓰는 기능</button>
                    <button className='menu-item'>⚙️설정</button>
                    <button className='menu-item'>🕒홈</button>
                </nav>

                <div className="spacer" />

                <div className='user-profile'>
                    <div className='avatar' />
                    <div className='username'>username</div>
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
                            <input type='text' 
                            placeholder='질문을 입력하세요..' className='input-field' />
                        

                        <button className='submit-button'>
                            <img src={arrowSubmit} alt='Submit'></img>
                        </button>
                    </div>

                    <div className='suggestions-buttons'>
                        <button>단축키 안내</button>
                        <button>자동실행</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );


}

export default FullExpandedWindow;