import React, { useState, useEffect } from 'react';
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
  width: 700px;
  background-color: #FFFFFF;
  border-radius: 24px;
  padding: 60px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  font-size: 28px;
  color: #858585;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: #000000;
  }
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  color: #1d1d1d;
  margin-bottom: -16px;
`;

const GameName = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #858585;
  margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 40px;
`;

const GameIcon = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
`;

const Description = styled.p`
  font-size: 20px;
  color: #858585;
  line-height: 1.8;
  white-space: pre-line;
  min-height: 140px;
`;

const SkipButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #009A73;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-left: auto;

  &:hover {
    opacity: 0.8;
  }
`;

export default function ExplainModal({ gameName, icon, description, onStart, onClose }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < description.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + description[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, description]);

  const handleSkip = () => {
    if (currentIndex < description.length) {
      setDisplayedText(description);
      setCurrentIndex(description.length);
    } else {
      onStart();
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <Title>이거 어떻게 해요??</Title>
        <GameName>{gameName}</GameName>
        
        <ContentWrapper>
          <GameIcon src={icon} alt={gameName} />
          <Description>{displayedText}</Description>
        </ContentWrapper>
        
        <SkipButton onClick={handleSkip}>
          {currentIndex < description.length ? '설명 건너뛰기 ▶▶' : '시작하기!'}
        </SkipButton>
      </ModalBox>
    </Overlay>
  );
}