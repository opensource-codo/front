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
  const sendMessage = async (method = "guide") => {

    //입력창이 공백일 때 
    if (!inputText.trim()) return;

    //사용자 채팅창에 추가
    setMessages(prev => [...prev, { from: 'user', text: inputText }]);
    
    const payload = {
      text: inputText,
      method: method
    };

    setInputText('');  // 입력창 비우기

    try {

      //서버에 analyze 요청보내기
      const res = await axios.post('http://localhost:8000/api/v1/userInput', payload);
      
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

  const [selectedSuggestion, setSelectedSuggestion] = useState(' ');

  // 엔터키 입력 처리 
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (selectedSuggestion === '단축키안내'){
        setInputText('단축키 안내');
        sendMessage('단축키 안내')
      } else if (selectedSuggestion === '자동실행'){
        //runAUtoExecution();
      } else {
        sendMessage();
      }
      sendMessage();
    }
  };

  // 단축키 안내 버튼 클릭 처리
  const handleShortcutGuide = () => {
    setInputText('단축키 안내');
    sendMessage('GUIDE');
  };

  // 자동 실행 버튼 클릭 처리
  const handleAutoExecution = () => {
    setInputText('자동 실행');
    sendMessage('EXECUTION');
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
        <button className="send-button" onClick={() => sendMessage()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          전송
        </button>
      </div>

      <div className="suggestion-buttons">
        <button onClick={handleShortcutGuide} className="suggestion-button">
          ⌨️ 단축키 안내
        </button>
        <button onClick={handleAutoExecution} className="suggestion-button">
          ⚡ 자동 실행
        </button>
      </div>
    </div>
  );
}

export default ExpandedWindow; 