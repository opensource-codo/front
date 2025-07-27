import minimizeIcon from '../assets/minimize.png';
import closeIcon from '../assets/close.png';
import '../css/FullExpandedWindow.css';

function FullExpandedWindow({ onMinimize, onClose}) {
    return (
        <div className='full-expanded-window'>
            <div className='header'>
                <img src={minimizeIcon} alt="Minimize" onClick={onMinimize} />
                <img src={closeIcon} alt="Close" onClick={onClose} />
            </div>

            <div className='body'>
                {/*추후에 추가될 .. */}
            </div>
        </div>
    )
}

export default FullExpandedWindow;