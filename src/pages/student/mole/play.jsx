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
    from { opacity: 0; }
    to { opacity: 1; }
`;

const fadeOut = keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
`;

const MessageOverlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 36px;
    font-weight: bold;
    color: #ff9292;
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
        margin-bottom: 50px;
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

export default function MolePlay() {
    const navigate = useNavigate();
    const [lives, setLives] = useState(TOTAL_LIVES);
    const [score, setScore] = useState(0);
    const [activeMole, setActiveMole] = useState(null); // 화면 렌더링용
    const [hitMole, setHitMole] = useState(null);
    const [showSlowMessage, setShowSlowMessage] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const moleStartTime = useRef(null);
    const gameInterval = useRef(null);
    const moleTimeoutRef = useRef(null); // 두더지 퇴장 타이머 ID
    const livesRef = useRef(TOTAL_LIVES); // 최신 lives 값

    // 💡 NEW: 두더지가 현재 올라와 있는 위치를 최신 상태로 추적하는 Ref
    const activeMoleRef = useRef(null);
    // lives/activeMole이 변경될 때마다 Ref 업데이트
    useEffect(() => {
        livesRef.current = lives;
    }, [lives]);

    useEffect(() => {
        activeMoleRef.current = activeMole;
    }, [activeMole]);


    const allSpots = Array.from({ length: NUM_SPOTS }, (_, i) => i);
    const topSpots = allSpots.slice(0, 2);
    const bottomSpots = allSpots.slice(2, 5);

    // 하트 감소 및 두더지 내림 로직
    const handleMoleTimeout = useCallback((spotIndex) => {
        // 💡 Ref를 사용하여 타이머가 만료되었을 때, 해당 두더지가 여전히 활성화 상태인지 **최신 값**으로 확인
        if (activeMoleRef.current === spotIndex) {
            if (livesRef.current > 0) {
                setLives(l => l - 1); // 하트 1개 감소
            }
            // activeMole Ref와 State를 모두 null로 설정하여 다음 두더지가 올라올 수 있도록 함
            activeMoleRef.current = null;
            setActiveMole(null);
        }

        moleStartTime.current = null;
        moleTimeoutRef.current = null; // 타이머 실행 완료
    }, []);

    // 두더지 올리기
    const showMole = useCallback(() => {
        if (livesRef.current <= 0) return;

        // 1. **이전 두더지 타이머 정리** (중복 타이머 실행 방지)
        if (moleTimeoutRef.current) {
            clearTimeout(moleTimeoutRef.current);
            moleTimeoutRef.current = null;
        }

        // 2. 💡 **Ref**를 사용하여 현재 두더지 등장 여부를 **최신 상태로** 확인
        if (activeMoleRef.current !== null) return;

        const randomSpot = Math.floor(Math.random() * NUM_SPOTS);

        // activeMole Ref와 State를 모두 업데이트
        activeMoleRef.current = randomSpot;
        setActiveMole(randomSpot);
        setHitMole(null);
        moleStartTime.current = Date.now();

        // 3. 퇴장 타이머 설정
        moleTimeoutRef.current = setTimeout(() => {
            handleMoleTimeout(randomSpot);
        }, MOLE_SHOW_TIME);

    }, [handleMoleTimeout]); // activeMole dependency 제거 (이제 Ref를 사용하므로)

    // 두더지 클릭 핸들러
    const handleMoleClick = useCallback((spotIndex) => {
        // 💡 **Ref**를 사용하여 현재 두더지 맞는지 **최신 상태로** 확인
        if (activeMoleRef.current !== spotIndex || hitMole !== null) return;

        // 1. 두더지를 맞췄을 때, 예약된 퇴장 타이머를 즉시 취소합니다. (하트 감소 방지)
        if (moleTimeoutRef.current) {
            clearTimeout(moleTimeoutRef.current);
            moleTimeoutRef.current = null;
        }

        const clickTime = Date.now();
        const reactionTime = clickTime - moleStartTime.current;

        // 2. 맞춤 처리: Ref와 State를 모두 null로 설정
        setHitMole(spotIndex);
        activeMoleRef.current = null;
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
    }, [hitMole]); // activeMole dependency 제거

    // 게임 시작 및 반복 로직 (showMole이 Ref만 참조하므로, 이 useEffect는 livesRef가 0이 될 때까지 안정적으로 실행됨)
    useEffect(() => {
        // 이전 인터벌 정리
        if (gameInterval.current) {
            clearInterval(gameInterval.current);
            gameInterval.current = null;
        }

        if (livesRef.current <= 0) return;

        // 초기 딜레이 후 게임 시작
        const startTimeout = setTimeout(() => {
            showMole();

            gameInterval.current = setInterval(() => {
                if (livesRef.current > 0) {
                    showMole();
                } else {
                    if (gameInterval.current) {
                        clearInterval(gameInterval.current);
                        gameInterval.current = null;
                    }
                }
            }, MOLE_SHOW_TIME + MOLE_INTERVAL);
        }, 1000);

        return () => {
            clearTimeout(startTimeout);
            if (gameInterval.current) {
                clearInterval(gameInterval.current);
            }
            if (moleTimeoutRef.current) {
                clearTimeout(moleTimeoutRef.current);
                moleTimeoutRef.current = null;
            }
        };
    }, [showMole]);

    // 생명이 0이 되면 게임 오버
    useEffect(() => {
        if (lives === 0 && !gameOver) {
            setGameOver(true);
            if (gameInterval.current) {
                clearInterval(gameInterval.current);
                gameInterval.current = null;
            }
            if (moleTimeoutRef.current) {
                clearTimeout(moleTimeoutRef.current);
                moleTimeoutRef.current = null;
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