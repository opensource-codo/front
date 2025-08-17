import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ onAuthed }) {
  const login = useGoogleLogin({
    flow: 'implicit',
    prompt: 'select_account',
    useOneTap: false,
    onSuccess: (res) => {
      console.log('로그인 성공:', res);
      onAuthed?.();
    },
    onError: (err) => console.error('로그인 실패:', err),
  });

  return <button onClick={() => login()}>구글로 로그인</button>;
}

