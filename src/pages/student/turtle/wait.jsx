import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FillHeartImg from '../../../assets/fillheart.png';
import Button from '../../../components/Button';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E3FFE9;
`;

const HeartWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 0px;
`;

const Heart = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const WelcomeText = styled.p`
  font-size: 32px;
  font-weight: bold;
  color: #000000;
  margin-bottom: -20px;
`;

const Highlight = styled.span`
  color: #009A73;
`;

const WaitingText = styled.p`
  font-size: 32px;
  font-weight: bold;
  color: #1d1d1d;
  margin-bottom: 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 28px;
  margin-top: 40px;
`;

export default function TurtleWait() {
  const location = useLocation();
  const navigate = useNavigate();
  const nickname = location.state?.nickname || '학생';
  const handleGameStartClick = () => {
    navigate('/std/turtle/ready');
  };

  return (
    <Container>
      <HeartWrapper>
        <Heart src={FillHeartImg} alt="fill heart" />
        <Heart src={FillHeartImg} alt="fill heart" />
        <Heart src={FillHeartImg} alt="fill heart" />
      </HeartWrapper>
      <WelcomeText>
        환영해요, <Highlight>{nickname}</Highlight> 학생
      </WelcomeText>
      <WaitingText>다른 친구들이 들어올 때까지 조금만 기다려요!</WaitingText>
      <ButtonWrapper>
        <Button onClick={handleGameStartClick}>버튼을 눌러 시작해요!!</Button>
      </ButtonWrapper>
    </Container>
  );
}