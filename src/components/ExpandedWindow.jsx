import React, { useState, seEffect, useContext } from 'react';
import axios from 'axios';
import maximizeIcon from '../assets/checkbox.png';
import closeIcon from '../assets/close.png';
import '../css/ExpandedWindow.css';

function ExpandedWindow({ onClose, onExpandFull }) {
  
  //상태 선언 
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { from: 'system', text: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);

  //전송 함수
  const sendMessage = async () => {

    //입력창이 공백일 때 
    if (!inputText.trim()) return;

    //사용자 채팅창에 추가
    setMessages(prev => [...prev, { from: 'user', text: inputText }]);
    
    const payload = {
      text: inputText
    };

    setInputText('');  // 입력창 비우기

    try {

      //서버에 analyze 요청보내기
      const res = await axios.post('http://localhost:8000/api/analyze', payload);
      
      //응답 메시지 추가
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: res.data.message }
        
      ]);

      //출력 타입에 따라 자동 확장
        if (res.data.output_type !== 'guide') {
            onExpandFull();
        }

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: '요청 처리 중 오류가 발생했습니다.' }
      ]);
      console.error(err);
    }
  };

  // 엔터키 입력 처리 
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="expanded-window">
      <div className="header">
        <img src={maximizeIcon} alt="Maximize" onClick={onExpandFull} />
        <img src={closeIcon} alt="Close" onClick={onClose} />
      </div>


      <div className="body">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="질문을 입력하세요..."
          className="chat-input"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="send-button" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
}

export default ExpandedWindow; 