import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';

import HeartImg from '../../../assets/fillheart.png';
import EmptyHeartImg from '../../../assets/emptyheart.png';
import EumImg from '../../../assets/eum.png';
import BgImg from '../../../assets/musicbg.png';

const TOTAL_LIVES = 3; 
const NOTE_SPEED = 5; 
const CLICK_ZONE_Y = 600; 
const JUDGEMENT_TOLERANCE = 50; 
const LANE_COUNT = 5; 
const LANE_POSITIONS = [160, 350, 540, 730, 930]; 

const fall = keyframes`
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(730px) scale(0.8);
    opacity: 0.5;
  }
`;

const StyledNote = styled.img.attrs(props => ({
  src: EumImg,
  alt: "Music Note",
  style: {
    left: `${props.$x}px`,
    top: `${props.$y}px`, 
  }
}))`
  position: absolute;
  width: 90px;
  height: 130px;
  animation: ${fall} linear;
  z-index: 5;
`;

function Note({ x, y, id }) {
    return (
        <StyledNote 
            key={id} 
            $x={x} 
            $y={y}
        />
    );
}

const hitAnimation = keyframes`
  0% { transform: scale(1); opacity: 0; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

const missAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const StyledJudgementText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  font-weight: bold;
  opacity: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  
  ${props => props.$type === 'perfect' && css`
    color: #ff99ff;
    animation: ${hitAnimation} 0.5s ease-out forwards;
  `}
  
  ${props => props.$type === 'fail' && css`
    color: #cc0066;
    animation: ${missAnimation} 0.8s ease-out forwards;
  `}
`;

function JudgementText({ type }) {
    return (
        <StyledJudgementText $type={type}>
            {type.toUpperCase()}!
        </StyledJudgementText>
    );
}

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px 60px;
  border-radius: 20px;
  text-align: center;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  width: 460px; 
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
  color: #333;
  margin-bottom: -8px;
`;

const ModalSubtitle = styled.p`
  font-size: 18px;
  color: #777;
  margin-bottom: 2px;
`;

const GameOverText = styled.div`
  font-size: 70px;
  font-weight: bold;
  color: #FF69B4; 
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.2s ease;
  user-select: none;

  &:active {
    transform: scale(0.95);
  }
`;

const ScoreDisplay = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50; 
  margin-top: 10px;
`;

function GameOverModal({ finalScore, onClose }) {
    const calculatedScore = finalScore * 10; 
    const [showScore, setShowScore] = useState(false);

    const handleGameOverClick = () => {
        setShowScore(!showScore);
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <CloseButton onClick={onClose}>x</CloseButton>
                <ModalTitle>점수를 확인하세요!</ModalTitle>
                <ModalSubtitle>GAME OVER 글자를 살짝 누르면 밑에 점수가 나타나요!!</ModalSubtitle>
                <GameOverText onClick={handleGameOverClick}>
                    GAME OVER
                </GameOverText>
                {showScore && <ScoreDisplay>SCORE: {calculatedScore}</ScoreDisplay>}
            </ModalContent>
        </ModalOverlay>
    );
};

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  background-image: url(${BgImg});
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
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

const ClickTargetWrapper = styled.div`
  position: absolute;
  bottom: 50px;
  right: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 100px;
  box-sizing: border-box;
`;

const ClickTarget = styled.img.attrs({
    src: HeartImg, 
    alt: "Click Target Heart"
})`
  width: 100px;
  height: 100px;
  opacity: 0; 
  cursor: pointer;
  z-index: 10;
`;

export default function MusicPlay() {
  const navigate = useNavigate();
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState([]); 
  const [judgement, setJudgement] = useState(null); 

  const nextNoteId = useRef(0);
  const gameLoopRef = useRef(null);
  const pendingMisses = useRef(0); 

  const handleJudgement = (type) => {
    setJudgement(type);
    setTimeout(() => setJudgement(null), 800); 
  };

  useEffect(() => {
    const noteGenerator = setInterval(() => {
      if (lives === 0) {
        clearInterval(noteGenerator);
        return;
      }
      
      const laneIndex = Math.floor(Math.random() * LANE_COUNT);
      const newNote = {
        id: nextNoteId.current++,
        lane: laneIndex,
        x: LANE_POSITIONS[laneIndex],
        y: -130, 
        state: 'active',
      };
      setNotes(prevNotes => [...prevNotes, newNote]);
    }, 2000); 

    return () => clearInterval(noteGenerator);
  }, [lives]); 

  useEffect(() => {
    const gameLoop = () => {
      if (lives === 0) {
          cancelAnimationFrame(gameLoopRef.current);
          return;
      }
      
      let missesInThisFrame = 0; 

      setNotes(prevNotes => {
        return prevNotes
          .map(note => {
            const newY = note.y + NOTE_SPEED;
            if (note.state === 'active' && newY > CLICK_ZONE_Y + JUDGEMENT_TOLERANCE) {
              missesInThisFrame++;
              return { ...note, y: newY, state: 'missed' };
            }
            return { ...note, y: newY };
          })
          .filter(note => note.y < 730); 
      });

      if (missesInThisFrame > 0) {
          pendingMisses.current += missesInThisFrame;
          handleJudgement('fail'); 
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [lives]); 
  
  useEffect(() => {
      if (pendingMisses.current > 0) {
          setLives(prev => Math.max(0, prev - pendingMisses.current));
          pendingMisses.current = 0;
      }
  });

  const handleLaneClick = useCallback((laneIndex) => {
    if (lives === 0) return;
      
    const noteToJudge = notes.find(note =>
      note.lane === laneIndex &&
      note.state === 'active' &&
      note.y >= CLICK_ZONE_Y - JUDGEMENT_TOLERANCE && 
      note.y <= CLICK_ZONE_Y + JUDGEMENT_TOLERANCE    
    );

    if (noteToJudge) {
      setScore(prev => prev + 100);
      handleJudgement('perfect');
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteToJudge.id));
    } else {
      handleJudgement('fail');
      setLives(prev => Math.max(0, prev - 1));
    }
  }, [notes, lives]); 

  const handleCloseModal = () => {
      navigate('/std/main'); 
  };
  return (
    <Container>
      <HeartWrapper>
        {Array.from({ length: TOTAL_LIVES }).map((_, index) => (
          <Heart 
            key={index}
            src={index < lives ? HeartImg : EmptyHeartImg}
            alt={index < lives ? "Filled Heart" : "Empty Heart"}
          />
        ))}
      </HeartWrapper>
      {notes.map(note => (
        <Note 
          key={note.id} 
          x={note.x} 
          y={note.y}
        />
      ))}
      {judgement && <JudgementText type={judgement} />}
      <ClickTargetWrapper>
        {LANE_POSITIONS.map((_, index) => (
          <ClickTarget
            key={index}
            onClick={() => handleLaneClick(index)} 
          />
        ))}
      </ClickTargetWrapper>
      {lives === 0 && (
        <>
            <div style={{ position: 'absolute', opacity: 0 }}>
                GAME OVER
            </div>
            <GameOverModal 
                finalScore={score} 
                onClose={handleCloseModal} 
            />
        </>
      )}
    </Container>
  );
}