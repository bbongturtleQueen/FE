import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import GameOver from '../../../components/gameover.jsx';

import HeartImg from '../../../assets/fillheart.png';
import EmptyHeartImg from '../../../assets/emptyheart.png';
import DefaultMole from '../../../assets/defaultmole.png';
import HitMole from '../../../assets/hitmole.png';
import BgImg from '../../../assets/molebg.png';

const TOTAL_LIVES = 3;
const NUM_SPOTS = 5;
const MOLE_SHOW_TIME = 1500; // 두더지가 올라와있는 시간
const MOLE_INTERVAL = 800; // 두더지 등장 간격
const SLOW_CLICK_THRESHOLD = 1000; // 느린 클릭 기준 (1초)

const MOLE_COLORS = {
  TITLE: '#000000',
  SUBTITLE: '#858585',
  GAME_OVER: '#A19081',
  GAME_OVER_HOVER: '#856C56',
  SCORE: '#6C4637',
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const MessageOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  color: #EF4444;
  z-index: 200;
  animation: ${props => props.$isShowing ? fadeIn : fadeOut} 0.3s ease-in-out;
  pointer-events: none;
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
    margin-bottom: 30px;
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
    margin: 0 100px;
  `}

  ${props => props.$isBottomEdge && css`
    margin: 0 120px;
  `}

  &:hover {
    opacity: 0.9;
  }
`;

const MoleImage = styled.img`
  position: absolute;
  top: ${props => props.$isTopRow ? '60%' : '20%'};
  left: ${props => props.$isTopRow ? '53%' : '50%'};
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.1s;
  pointer-events: none;

  ${props => props.$isVisible && css`
    opacity: 1;
  `}
`;

export default function MolePlay() {
  const navigate = useNavigate();
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [score, setScore] = useState(0);
  const [activeMole, setActiveMole] = useState(null); // 현재 올라온 두더지 위치
  const [hitMole, setHitMole] = useState(null); // 맞은 두더지 위치
  const [showSlowMessage, setShowSlowMessage] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const moleStartTime = useRef(null);
  const gameInterval = useRef(null);

  const allSpots = Array.from({ length: NUM_SPOTS }, (_, i) => i);
  const topSpots = allSpots.slice(0, 2);
  const bottomSpots = allSpots.slice(2, 5);

  // 두더지 올리기
  const showMole = useCallback(() => {
    if (lives === 0) return;

    const randomSpot = Math.floor(Math.random() * NUM_SPOTS);
    setActiveMole(randomSpot);
    setHitMole(null);
    moleStartTime.current = Date.now();

    // 일정 시간 후 두더지 내리기
    setTimeout(() => {
      setActiveMole(prev => {
        // 두더지가 맞지 않았으면 하트 감소
        if (prev === randomSpot) {
          setLives(l => Math.max(0, l - 1));
        }
        return null;
      });
      moleStartTime.current = null;
    }, MOLE_SHOW_TIME);
  }, [lives]);

  // 두더지 클릭 핸들러
  const handleMoleClick = useCallback((spotIndex) => {
    if (activeMole !== spotIndex || hitMole !== null) return;

    const clickTime = Date.now();
    const reactionTime = clickTime - moleStartTime.current;

    // 두더지 맞춤
    setHitMole(spotIndex);
    setActiveMole(null);
    setScore(prev => prev + 100);

    // 느린 클릭 체크
    if (reactionTime > SLOW_CLICK_THRESHOLD) {
      setShowSlowMessage(true);
      setTimeout(() => {
        setShowSlowMessage(false);
      }, 1000);
    }

    // hit 이미지 표시 후 사라지기
    setTimeout(() => {
      setHitMole(null);
    }, 300);
  }, [activeMole, hitMole]);

  // 게임 시작
  useEffect(() => {
    // 초기 딜레이 후 게임 시작
    const startTimeout = setTimeout(() => {
      showMole();

      gameInterval.current = setInterval(() => {
        showMole();
      }, MOLE_SHOW_TIME + MOLE_INTERVAL);
    }, 1000);

    return () => {
      clearTimeout(startTimeout);
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
    };
  }, [showMole]);

  // 생명이 0이 되면 게임 오버
  useEffect(() => {
    if (lives === 0 && !gameOver) {
      setGameOver(true);
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
    }
  }, [lives, gameOver]);

  const handleGameOverClose = () => {
    navigate('/std/main');
  };

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

      {showSlowMessage && (
        <MessageOverlay $isShowing={showSlowMessage}>
          좀 더 빠르게!
        </MessageOverlay>
      )}

      <GameSpotContainer>
        <GameSpotRow $isTopRow={true}>
          {topSpots.map((index) => (
            <GameSpot
              key={index}
              onClick={() => handleMoleClick(index)}
              $isTopRow={true}
            >
              <MoleImage
                src={hitMole === index ? HitMole : DefaultMole}
                $isVisible={activeMole === index || hitMole === index}
                $isTopRow={true}
              />
            </GameSpot>
          ))}
        </GameSpotRow>

        <GameSpotRow>
          {bottomSpots.map((index, idx) => (
            <GameSpot
              key={index}
              onClick={() => handleMoleClick(index)}
              $isBottomEdge={idx === 0 || idx === 2}
            >
              <MoleImage
                src={hitMole === index ? HitMole : DefaultMole}
                $isVisible={activeMole === index || hitMole === index}
                $isTopRow={false}
              />
            </GameSpot>
          ))}
        </GameSpotRow>
      </GameSpotContainer>

      {gameOver && (
        <GameOver
          finalScore={score}
          onClose={handleGameOverClose}
          titleColor={MOLE_COLORS.TITLE}
          subtitleColor={MOLE_COLORS.SUBTITLE}
          gameOverColor={MOLE_COLORS.GAME_OVER}
          gameOverHoverColor={MOLE_COLORS.GAME_OVER_HOVER}
          scoreColor={MOLE_COLORS.SCORE}
        />
      )}
    </Container>
  );
}