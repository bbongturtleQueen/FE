import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ContentModal from '../../../components/contentmodal.jsx';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E3FFE9;
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
`;

const NicknameInput = styled.input`
  width: 400px;
  padding: 16px 20px;
  border: 1px solid #B4B4B4;
  border-radius: 10px;
  font-size: 18px;
  margin-bottom: 40px;

  &:focus {
    outline: none;
    border-color: #22C55E;
    color: #009A73;
  }

  &::placeholder {
    color: #B4B4B4;
  }
`;

export default function TurtleNickname() {
  const navigate = useNavigate();
  const location = useLocation();
  const [nickname, setNickname] = useState('');

  const inviteCode = location.state?.inviteCode;

  const handleSubmit = async () => {
    try {
      // 1️⃣ 먼저 학생 등록 API 호출
      const registerResponse = await fetch(`${import.meta.env.VITE_API_URL}/ppang/kid/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: nickname
        })
      });

      const registerData = await registerResponse.json();

      if (registerData.status !== 'success') {
        alert("학생 등록에 실패했습니다!");
        return;
      }

      // 학생 ID를 localStorage에 저장
      localStorage.setItem('studentId', nickname);

      // 2️⃣ 방 참여 API 호출
      const joinResponse = await fetch(`${import.meta.env.VITE_API_URL}/ppang/kid/enter-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: inviteCode,
          id: nickname
        })
      });

      const joinData = await joinResponse.json();

      if (joinData.status === 'valid') {
        navigate('/std/turtle/wait', {
          state: {
            nickname,
            inviteCode
          }
        });
      } else {
        alert("방 참여에 실패했습니다!");
      }

    } catch (err) {
      console.error(err);
      alert("서버 오류!");
    }
  };

  return (
    <Container>
      <ContentModal
        buttonText="닉네임 저장하기"
        onSubmit={handleSubmit}
        disabled={nickname.trim() === ""}
      >
        <Title>게임에서 사용할 닉네임을 적어요!</Title>
        <NicknameInput
          type="text"
          placeholder="닉네임을 입력하세요.."
          value={nickname}
          autoComplete="off"
          onChange={(e) => setNickname(e.target.value)}
        />
      </ContentModal>
    </Container>
  );
}
