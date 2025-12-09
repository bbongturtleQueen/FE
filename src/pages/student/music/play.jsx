import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import GameOver from '../../../components/gameover.jsx';

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

const RHYTHM_COLORS = {
    TITLE: '#000000',
    SUBTITLE: '#858585',
    GAME_OVER: '#FF78A7',
    GAME_OVER_HOVER: '#FF0059',
    SCORE: '#FF4CEA',
};

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
    cursor: default;
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

const ToggleSwitch = styled.button`
    position: absolute;
    top: 20px;
    right: 30px;
    width: 70px;
    height: 34px;
    border-radius: 17px;
    background-color: ${props => props.$isOn ? '#defff8' : '#fbfffb'};
    cursor: pointer;
    transition: background-color 0.3s ease;
    z-index: 100;
    padding: 2px;
    display: flex;
    align-items: center;

    &:hover {
        background-color: ${props => props.$isOn ? '#f6fff3' : '#fbfffb'};
    }
`;

const ToggleKnob = styled.div`
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
    transform: translateX(${props => props.$isOn ? '34px' : '0px'});
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
`;

const ClickTargetWrapper = styled.div`
    position: absolute;
    bottom: 50px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 100px;
    padding: 0 100px;
    box-sizing: border-box;
`;

const ClickTarget = styled.div`
    width: 100px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    opacity: 1;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);

    &:hover {
        background-color: rgba(255, 255, 255, 0.4);
    }
`;

export default function MusicPlay() {
    const navigate = useNavigate();
    const [lives, setLives] = useState(TOTAL_LIVES);
    const [score, setScore] = useState(0);
    const [notes, setNotes] = useState([]);
    const [judgement, setJudgement] = useState(null);
    const [isMusicOn, setIsMusicOn] = useState(true);

    const livesRef = useRef(lives);
    useEffect(() => { livesRef.current = lives; }, [lives]);

    const nextNoteId = useRef(0);
    const gameLoopRef = useRef(null);
    const pendingMisses = useRef(0);
    const audioRef = useRef(null);

    const handleJudgement = (type) => {
        setJudgement(type);
        setTimeout(() => setJudgement(null), 800);
    };

    const toggleMusic = () => {
        setIsMusicOn(prev => !prev);
    };

    useEffect(() => {
        if (audioRef.current) {
            if (isMusicOn && lives > 0) {
                audioRef.current.play().catch(err => console.log('Audio play failed:', err));
            } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [isMusicOn, lives]);

    useEffect(() => {
        const noteGenerator = setInterval(() => {
            if (livesRef.current === 0) {
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
        }, 800);

        return () => clearInterval(noteGenerator);
    }, []);

    useEffect(() => {
        const gameLoop = () => {
            if (livesRef.current === 0) {
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
                    .filter(note => !(note.state === 'missed' && note.y > 730));
            });

            if (missesInThisFrame > 0) {
                pendingMisses.current += missesInThisFrame;
                handleJudgement('fail');
            }

            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };

        gameLoopRef.current = requestAnimationFrame(gameLoop);

        return () => cancelAnimationFrame(gameLoopRef.current);
    }, []);

    useEffect(() => {
        if (pendingMisses.current > 0) {
            setLives(prev => Math.max(0, prev - pendingMisses.current));
            pendingMisses.current = 0;
        }
    }, [notes]);

    const handleLaneClick = useCallback((laneIndex) => {
        if (livesRef.current === 0) return;

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
    }, [notes]);

    const handleCloseModal = () => {
        navigate('/std/main');
    };

    // 라즈베리파이 WebSocket
    useEffect(() => {
        const ws = new WebSocket('ws://10.150.1.242:8765/ws');

        ws.onopen = () => {
            console.log('라즈베리파이 연결됨 (음악 게임)');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'button_press') {
                const buttonNumber = data.button; // 1~5
                console.log(`버튼 ${buttonNumber} 눌림`);
                handleLaneClick(buttonNumber - 1); // 0~4 인덱스로 변환
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket 에러:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket 연결 끊김');
        };

        return () => {
            ws.close();
        };
    }, [handleLaneClick]);

    return (
        <Container>
            <audio
                ref={audioRef}
                loop
                preload="auto"
            >
                <source src="/musicbg.mp3" type="audio/mpeg" />
            </audio>

            <HeartWrapper>
                {Array.from({ length: TOTAL_LIVES }).map((_, index) => (
                    <Heart
                        key={index}
                        src={index < lives ? HeartImg : EmptyHeartImg}
                        alt={index < lives ? "Filled Heart" : "Empty Heart"}
                    />
                ))}
            </HeartWrapper>

            <ToggleSwitch onClick={toggleMusic} $isOn={isMusicOn}>
                <ToggleKnob $isOn={isMusicOn}>
                    {isMusicOn ? 'ON' : 'OFF'}
                </ToggleKnob>
            </ToggleSwitch>

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
                    >
                        {index + 1}
                    </ClickTarget>
                ))}
            </ClickTargetWrapper>

            {lives === 0 && (
                <>
                    <div style={{ position: 'absolute', opacity: 0 }}>
                        GAME OVER
                    </div>
                    <GameOver
                        finalScore={score}
                        onClose={handleCloseModal}
                        titleColor={RHYTHM_COLORS.TITLE}
                        subtitleColor={RHYTHM_COLORS.SUBTITLE}
                        gameOverColor={RHYTHM_COLORS.GAME_OVER}
                        gameOverHoverColor={RHYTHM_COLORS.GAME_OVER_HOVER}
                        scoreColor={RHYTHM_COLORS.SCORE}
                    />
                </>
            )}
        </Container>
    );
}