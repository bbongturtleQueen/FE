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

const Highlight = styled.span`
  color: #009A73;
  font-weight: bold;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 28px;
  margin-top: 40px;
`;

const StartText = styled.p`
  font-size: 18px;
  color: #858585;
`;

export default function Welcome() {
  const navigate = useNavigate();
  const loginClick = () => {
    navigate('/tch/login');
  };

  return (
    <Container>
      <HeartWrapper>
        <Heart src={HeartImg} alt="heart" />
      </HeartWrapper>
      <WelcomeText>
        안녕하세요, 학생들의 사칙연산을 위해
      </WelcomeText>
      <ThankText>
        저희 뿅!거북팡을 선택해주셔서 감사합니다
      </ThankText>
      <ButtonWrapper>
        <Button onClick={loginClick}>로그인하기</Button>
      </ButtonWrapper>
      <StartText>
        처음이신가요? <Highlight>회원가입하기</Highlight>
      </StartText>
    </Container>
  );
}