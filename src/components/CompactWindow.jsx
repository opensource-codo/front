import React from 'react';
import codoButton from '../assets/codo_button.png'

function CompactWindow({ onExpand }){
    return (
        <div className="compact-window">
            <img 
                src={codoButton}
                alt="도움요청버튼"
                onClick={onExpand}
                style={{
                    cursor: 'pointer',
                    width: '120px',
                    height: 'auto',
                }}/>
        </div>
    
    );
}

export default CompactWindow;