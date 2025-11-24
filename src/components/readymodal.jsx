import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  width: 400px;
  height: 200px;
  background-color: #FFFFFF;
  border-radius: 24px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Title = styled.p`
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 30px;
`;

const CountWrapper = styled.div`
  display: flex;
  gap: 24px;
`;

const CountCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  transition: all 0.3s ease;

  ${props => props.active ? css`
    background-color: ${props.color};
    color: white;
    border: 3px solid ${props.color};
  ` : css`
    background-color: white;
    color: ${props.color};
    border: 5px solid ${props.color};
  `}
`;

export default function ReadyModal({ color = '#4ADE80', gameRoute }) {
  const navigate = useNavigate();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate(gameRoute);
    }
  }, [count, navigate, gameRoute]);

  return (
    <Overlay>
      <ModalBox>
        <Title>준비됐나요?!</Title>
        <CountWrapper>
          <CountCircle active={count === 3} color={color}>3</CountCircle>
          <CountCircle active={count === 2} color={color}>2</CountCircle>
          <CountCircle active={count === 1} color={color}>1</CountCircle>
        </CountWrapper>
      </ModalBox>
    </Overlay>
  );
}