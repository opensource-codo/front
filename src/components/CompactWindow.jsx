import { useState, useEffect, useRef } from 'react';
import codoButton from '../assets/CODO_icon.png';
import '../css/App.css';

function CompactWindow({ onExpand }) {
    const [pos, setPos] = useState(() => {
        try {
            const saved = localStorage.getItem('codo_compact_pos');
            if (saved) return JSON.parse(saved);
        } catch {}
        return { x: window.innerWidth - 150, y: 20 };
    });

    const dragging = useRef(false);
    const hasMoved = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const startClient = useRef({ x: 0, y: 0 });

    // 위치 localStorage 저장
    useEffect(() => {
        localStorage.setItem('codo_compact_pos', JSON.stringify(pos));
    }, [pos]);

    // 전역 mousemove / mouseup 등록
    useEffect(() => {
        const onMouseMove = (e) => {
            if (!dragging.current) return;

            const dx = e.clientX - startClient.current.x;
            const dy = e.clientY - startClient.current.y;
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasMoved.current = true;

            if (hasMoved.current) {
                setPos({
                    x: Math.max(0, Math.min(window.innerWidth  - 140, e.clientX - dragOffset.current.x)),
                    y: Math.max(0, Math.min(window.innerHeight - 140, e.clientY - dragOffset.current.y)),
                });
            }
        };

        const onMouseUp = () => {
            if (!hasMoved.current) onExpand();
            dragging.current = false;
            hasMoved.current = false;
            document.body.style.cursor = '';
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup',   onMouseUp);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup',   onMouseUp);
        };
    }, [onExpand]);

    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        dragging.current = true;
        hasMoved.current = false;
        dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        startClient.current = { x: e.clientX, y: e.clientY };
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
    };

    return (
        <div
            className="compact-window"
            style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999, cursor: 'grab' }}
            onMouseDown={handleMouseDown}
        >
            <div className="compact-button-container">
                <img
                    src={codoButton}
                    alt="도움요청버튼"
                    className="compact-icon"
                    draggable={false}
                />
                <div className="pulse-indicator"></div>
            </div>
        </div>
    );
}

export default CompactWindow;
