import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: absolute; 
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

const ModalContent = styled.div`
  background-color: white;
  padding: 40px 60px;
  border-radius: 20px;
  text-align: center;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  width: 500px; 
  height: 300px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;

const ModalTitle = styled.h2`
  font-size: 28px;
  color: ${props => props.$color || '#333'};
  margin-bottom: -8px;
`;

const ModalSubtitle = styled.p`
  font-size: 18px;
  color: ${props => props.$color || '#777'};
  margin-bottom: 0px;
`;

const GameOverText = styled.div`
  font-size: 70px;
  font-weight: bold;
  color: ${props => props.$color || '#FF78A7'}; 
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.2s ease;
  user-select: none;
  &:hover {
    color: ${props => props.$hoverColor || '#FF0059'};
  }
  &:active {
    transform: scale(0.95);
  }
`;

const ScoreDisplay = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.$color || '#4CAF50'}; 
  margin-top: 0px;
`;

export default function GameOverModal({ 
    finalScore, 
    onClose, 
    titleColor,
    subtitleColor,
    gameOverColor,
    gameOverHoverColor,
    scoreColor
}) {
    const calculatedScore = finalScore * 10; 
    const [showScore, setShowScore] = useState(false);

    const handleGameOverClick = () => {
        setShowScore(!showScore);
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <CloseButton onClick={onClose}>x</CloseButton>
                <ModalTitle $color={titleColor}>점수를 확인하세요!</ModalTitle>
                <ModalSubtitle $color={subtitleColor}>GAME OVER 글자를 살짝 눌러보세요!!</ModalSubtitle>
                <GameOverText 
                    $color={gameOverColor}
                    $hoverColor={gameOverHoverColor}
                    onClick={handleGameOverClick}
                >
                    GAME OVER
                </GameOverText>
                {showScore && <ScoreDisplay $color={scoreColor}>SCORE: {calculatedScore}</ScoreDisplay>}
            </ModalContent>
        </ModalOverlay>
    );
};