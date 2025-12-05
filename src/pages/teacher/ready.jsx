import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FillHeartImg from '../../assets/fillheart.png';
import Button from '../../components/Button';

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

export default function Ready() {
  const location = useLocation();
  const navigate = useNavigate();
  const [teacherId, setTeacherId] = useState('teacher');

  useEffect(() => {
    const storedTeacherId = localStorage.getItem('teacherId');
    if (storedTeacherId) {
      setTeacherId(storedTeacherId);
    }
  }, []);
  const handleMakeProblemClick = () => {
    navigate('/tch/makeproblem');
  };
  const handleChooseSetClick = () => {
    navigate('/tch/chooseset');
  }

  return (
    <Container>
      <HeartWrapper>
        <Heart src={FillHeartImg} alt="fill heart" />
        <Heart src={FillHeartImg} alt="fill heart" />
        <Heart src={FillHeartImg} alt="fill heart" />
      </HeartWrapper>
      <WelcomeText>
        환영합니다, <Highlight>{teacherId}</Highlight> 님
      </WelcomeText>
      <WaitingText>문제를 생성하거나 만든 세트를 고를 수 있어요!</WaitingText>
      <ButtonWrapper>
        <Button onClick={handleMakeProblemClick}>문제 만들기</Button>
        <Button onClick={handleChooseSetClick}>세트 고르기</Button>
      </ButtonWrapper>
    </Container>
  );
}