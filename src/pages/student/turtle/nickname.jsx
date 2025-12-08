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

  const handleSubmit = () => {
    // 학생 ID를 localStorage에 저장
    localStorage.setItem('studentId', nickname);

    // wait 건너뛰고 바로 ready로 이동
    navigate('/std/turtle/ready', {
      state: {
        nickname,
        inviteCode
      }
    });
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
