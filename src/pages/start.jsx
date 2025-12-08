import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';
import LogoImg from '../assets/logo.png';
import BackImg from '../assets/back.png';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${BackImg});
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  width: 350px;
`;

const Logo = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 28px;
  margin-top: 40px;
`;

export default function Start() {
  const navigate = useNavigate();

  const handleTeacherClick = () => {
    navigate('/tch/welcome');
  };

  const handleStudentClick = () => {
    navigate('/std/main');
  };

  return (
    <Container>
      <LogoContainer>
        <Logo src={LogoImg} alt="뿅!거북팡 로고"/>
      </LogoContainer>
      
      <ButtonWrapper>
        <Button onClick={handleTeacherClick}>선생님으로 시작하기</Button>
        <Button onClick={handleStudentClick}>어린이로 시작하기</Button>
      </ButtonWrapper>
    </Container>
  );
}