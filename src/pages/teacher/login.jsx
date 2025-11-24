import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ContentModal from '../../components/contentmodal.jsx';

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
  border: 2px solid #B4B4B4;
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
  const [nickname, setNickname] = useState('');

  const handleSubmit = () => {
    // 닉네임을 다음 페이지로 전달
    navigate('/std/turtle/wait', { state: { nickname } });
  };

  const isNicknameValid = nickname.trim() !== '';

  return (
    <Container>
      <ContentModal
        buttonText="로그인하기"
        onSubmit={handleSubmit}
        onClose={() => {}}
        disabled={!isNicknameValid}
      >
        <Title>로그인</Title>
        <NicknameInput
          type="text"
          placeholder="아이디를 입력하세요.."
          value={nickname}
          autoComplete="off"
          onChange={(e) => setNickname(e.target.value)}
        />
      </ContentModal>
    </Container>
  );
}