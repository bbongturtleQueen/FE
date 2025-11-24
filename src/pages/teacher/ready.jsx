import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import HeartImg from '../../assets/heart.png';

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
  margin-bottom: 20px;
`;

const Heart = styled.img`
  width: 270px;
  height: 80px;
  object-fit: contain;
`;

const WelcomeText = styled.p`
  font-size: 32px;
  font-weight: bold;
  color: #000000;
  margin-bottom: -20px;
`;

const ThankText = styled.p`
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

export default function Ready() {
  const navigate = useNavigate();
  const handleProblemClick = () => {
    navigate('/tch/makeproblem');
  };

  const handleSetClick = () => {
    navigate('/tch/chooseset');
  };

  return (
    <Container>
      <HeartWrapper>
        <Heart src={HeartImg} alt="heart" />
      </HeartWrapper>
      <WelcomeText>
        환영합니다, 학생들의 사칙연산을 위해
      </WelcomeText>
      <ThankText>
        문제를 만들어 새로운 세트를 생성하세요!
      </ThankText>
      <ButtonWrapper>
        <Button onClick={handleProblemClick}>문제 만들기</Button>
        <Button onClick={handleSetClick}>세트 고르기</Button>
      </ButtonWrapper>
    </Container>
  );
}