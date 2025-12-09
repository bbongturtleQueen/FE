import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import GameOver from '../../../components/gameover.jsx';

import HeartImg from '../../../assets/fillheart.png';
import EmptyHeartImg from '../../../assets/emptyheart.png';
import TurtleImg from '../../../assets/turtle.png';
import BgImg from '../../../assets/memorybg.png';

const TOTAL_LIVES = 3;
const NUM_SPOTS = 5; 
const BLINK_DURATION = 500; 
const INTERVAL_TIME = 1000; 

const MEMORY_COLORS = {
  TITLE: '#000000',
  SUBTITLE: '#858585',
  GAME_OVER: '#FFDF77',
  GAME_OVER_HOVER: '#FDC200',
  SCORE: '#F79800',
};

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  
  div {
      padding: 30px 50px;
      background: white;
      border-radius: 15px;
      font-size: 40px;
      font-weight: bold;
      color: ${props => props.$isError ? '#EF4444' : '#009A73'};
      cursor: pointer;
  }
`;

const Container = styled.div`
  width: 1180px;
  height: 730px;
  background-image: url(${BgImg}); 
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  user-select: none;
`;

const HeartWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 30px;
  display: flex;
  gap: 8px;
`;

const Heart = styled.img`
  width: 50px;
  height: 42px;
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  font-size: 32px;
  font-weight: bold;
  color: #1d1d1d;
  z-index: 10;
`;

const GameSpotContainer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 1100px; 
`;

const GameSpotRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  ${props => props.$isTopRow && css`
    margin-bottom: -30px;
  `}
`;

const ANSWER_BUTTON_WIDTH = 220;

const GameSpot = styled.div`
  width: ${ANSWER_BUTTON_WIDTH}px;
  height: 200px;
  background-color: transparent;
  position: relative;
  cursor: pointer;

  ${props => props.$isTopRow && css`
    margin: 0 80px;
  `}

  ${props => props.$isBottomEdge && css`
    margin: 0 100px;
  `}

  &:hover {
    opacity: 0.9;
  }
`;

const TurtleImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.1s;
  pointer-events: none;

  ${props => props.$isVisible && css`
    opacity: 1;
  `}
`;


export default function TurtleGame() {
  const navigate = useNavigate();
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);

  const [pattern, setPattern] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [gameState, setGameState] = useState('IDLE');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [blinkingSpot, setBlinkingSpot] = useState(null);
  const allSpots = Array.from({ length: NUM_SPOTS }, (_, i) => i);

  const generateNextPattern = useCallback(() => {
    const newPattern = [...pattern];
    newPattern.push(Math.floor(Math.random() * NUM_SPOTS));
    setPattern(newPattern);
    return newPattern;
  }, [pattern]);

  const startNewStage = useCallback((currentPattern = pattern) => {
    if (lives === 0) {
      setGameState('GAME_OVER');
      return;
    }
    
    setGameState('SHOWING_PATTERN');
    setPlayerSequence([]);
    setMessage('');
    setIsModalOpen(false);
    setIsErrorModal(false);

    let patternToShow = currentPattern;
    if (currentPattern.length < stage) {
        patternToShow = generateNextPattern(); 
    }
    
    setTimeout(() => showPattern(patternToShow), 1000);
  }, [lives, stage, pattern, generateNextPattern]);

  const showPattern = (currentPattern) => {
    let i = 0;

    const interval = setInterval(() => {
      if (i >= currentPattern.length) {
        clearInterval(interval);
        setBlinkingSpot(null);
        setMessage('PUSH!');
        setIsModalOpen(true);
        setIsErrorModal(false);

        setTimeout(() => {
          setIsModalOpen(false);
          setGameState('WAITING_INPUT');
        }, 500);
        return;
      }

      const spotIndex = currentPattern[i];
      setBlinkingSpot(spotIndex);

      setTimeout(() => {
        setBlinkingSpot(null);
      }, BLINK_DURATION);

      i++;
    }, INTERVAL_TIME);
  };

  const handleSpotClick = useCallback((clickedIndex) => {
    if (gameState !== 'WAITING_INPUT' || isModalOpen) return;

    const newSequence = [...playerSequence, clickedIndex];
    const currentStep = newSequence.length - 1;

    if (clickedIndex !== pattern[currentStep]) {
      setLives(prev => Math.max(0, prev - 1));
      setMessage('틀렸어요!');
      setIsErrorModal(true);
      setIsModalOpen(true);
      setGameState('IDLE'); 
      
      if (lives - 1 > 0) {
          setTimeout(() => {
              startNewStage(pattern); 
          }, 1500);
      }
      setPlayerSequence([]);
      return;
    }
    setPlayerSequence(newSequence);

    if (newSequence.length === pattern.length) {
      setScore(prev => prev + 100);
      setStage(prev => prev + 1);
      setMessage('성공!');
      setIsErrorModal(false);
      setIsModalOpen(true);
      setGameState('IDLE'); 
      
      setTimeout(() => {
        startNewStage(); 
      }, 1500);
    }
  }, [gameState, isModalOpen, playerSequence, pattern, startNewStage, lives]);

  useEffect(() => {
    if (lives === 0 && gameState !== 'GAME_OVER') {
      setGameState('GAME_OVER');
      setMessage(`GAME OVER`);
      setIsErrorModal(false);
      setIsModalOpen(true);
    }
  }, [lives, gameState]);

  useEffect(() => {
    const newPattern = [Math.floor(Math.random() * NUM_SPOTS)];
    setPattern(newPattern);
    setTimeout(() => {
      setGameState('SHOWING_PATTERN');
      showPattern(newPattern);
    }, 1000);
  }, []);

  const handleModalClick = () => {
      if (gameState === 'GAME_OVER') {
          navigate('/std/main');
      }
  };

  const topSpots = allSpots.slice(0, 2);
  const bottomSpots = allSpots.slice(2, 5);

  // 라즈베리파이 버튼 입력 처리

  return (
    <Container>

      <HeartWrapper>
        {Array.from({ length: TOTAL_LIVES }).map((_, index) => (
          <Heart
            key={index}
            src={index < lives ? HeartImg : EmptyHeartImg}
            alt="Life"
          />
        ))}
      </HeartWrapper>

      <GameSpotContainer>
        <GameSpotRow $isTopRow={true}>
          {topSpots.map((index) => (
            <GameSpot
              key={index}
              onClick={() => handleSpotClick(index)}
              $isTopRow={true}
            >
              <TurtleImage
                src={TurtleImg}
                $isVisible={gameState === 'SHOWING_PATTERN' && blinkingSpot === index}
              />
            </GameSpot>
          ))}
        </GameSpotRow>

        <GameSpotRow>
          {bottomSpots.map((index, idx) => (
            <GameSpot
              key={index}
              onClick={() => handleSpotClick(index)}
              $isBottomEdge={idx === 0 || idx === 2}
            >
              <TurtleImage
                src={TurtleImg}
                $isVisible={gameState === 'SHOWING_PATTERN' && blinkingSpot === index}
              />
            </GameSpot>
          ))}
        </GameSpotRow>
      </GameSpotContainer>

      {isModalOpen && gameState !== 'GAME_OVER' && (
        <ModalOverlay onClick={handleModalClick} $isError={isErrorModal}>
          <div onClick={(e) => e.stopPropagation()}>
            {message}
          </div>
        </ModalOverlay>
      )}

      {lives === 0 && (
        <GameOver 
            finalScore={score} 
            onClose={handleModalClick} 
            titleColor={MEMORY_COLORS.TITLE}
            subtitleColor={MEMORY_COLORS.SUBTITLE}
            gameOverColor={MEMORY_COLORS.GAME_OVER}
            gameOverHoverColor={MEMORY_COLORS.GAME_OVER_HOVER}
            scoreColor={MEMORY_COLORS.SCORE}
        />
      )}
    </Container>
  );
}