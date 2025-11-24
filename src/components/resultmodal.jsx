import React, { useEffect } from 'react';
import styled from 'styled-components';

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
  width: 420px;
  background-color: #FFFFFF;
  border-radius: 24px;
  border: 6px solid ${props => props.isCorrect ? '#4ADE80' : '#EF4444'};
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  color: #1d1d1d;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Icon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 7px solid ${props => props.isCorrect ? '#4ADE80' : '#EF4444'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconSymbol = styled.div`
  font-size: 60px;
  font-weight: bold;
  color: ${props => props.isCorrect ? '#4ADE80' : '#EF4444'};
`;

export default function ResultModal({ isCorrect, onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <Overlay>
      <ModalBox isCorrect={isCorrect}>
        <Title>{isCorrect ? '정답이에요!!' : '오답이에요!!'}</Title>
        <Icon isCorrect={isCorrect}>
          <IconSymbol isCorrect={isCorrect}>
            {isCorrect ? '✓' : '✕'}
          </IconSymbol>
        </Icon>
      </ModalBox>
    </Overlay>
  );
}