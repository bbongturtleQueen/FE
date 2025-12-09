import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import GameOver from '../../../components/gameover.jsx';

import HeartImg from '../../../assets/fillheart.png';
import EmptyHeartImg from '../../../assets/emptyheart.png';
import EumImg from '../../../assets/eum.png';
import BgImg from '../../../assets/musicbg.png';

const TOTAL_LIVES = 3;
const NOTE_SPEED = 4;
const CLICK_ZONE_Y = 600;
const JUDGEMENT_TOLERANCE = 50;
const LANE_COUNT = 5;
const LANE_POSITIONS = [160, 350, 540, 730, 930]; // 레인 인덱스 0, 1, 2, 3, 4에 대응

const NOTE_GENERATION_INTERVAL = 1700; 

const RHYTHM_COLORS = {
    TITLE: '#000000',
    SUBTITLE: '#858585',
    GAME_OVER: '#FF78A7',
    GAME_OVER_HOVER: '#FF0059',
    SCORE: '#FF4CEA',
};

// --- Styled Components ---

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
    bottom: 70px;
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
    background-color: transparent;
    border-radius: 10px;
    opacity: 0;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
`;
// --- Component Logic ---
export default function MusicPlay() {
    const navigate = useNavigate();
    const [lives, setLives] = useState(TOTAL_LIVES);
    const [score, setScore] = useState(0);
    const [notes, setNotes] = useState([]);
    const [judgement, setJudgement] = useState(null);
    const [isMusicOn, setIsMusicOn] = useState(true);

    const livesRef = useRef(lives);
    const notesRef = useRef(notes);
    
    useEffect(() => { livesRef.current = lives; }, [lives]);

    const nextNoteId = useRef(0);
    const gameLoopRef = useRef(null);
    const pendingMisses = useRef(0);
    const audioRef = useRef(null);

    const handleJudgement = useCallback((type) => {
        setJudgement(type);
        setTimeout(() => setJudgement(null), 800);
    }, []);

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

    // 노트 생성 루프
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
            setNotes(prevNotes => {
                const updated = [...prevNotes, newNote];
                notesRef.current = updated; 
                return updated;
            });
        }, NOTE_GENERATION_INTERVAL); 

        return () => clearInterval(noteGenerator);
    }, []);

    // 게임 루프 (노트 이동, 미스 처리, 노트 정리)
    useEffect(() => {
        const gameLoop = () => {
            if (livesRef.current === 0) {
                cancelAnimationFrame(gameLoopRef.current);
                return;
            }
            let missesInThisFrame = 0;

            setNotes(prevNotes => {
                const updatedNotes = prevNotes
                    .map(note => {
                        const newY = note.y + NOTE_SPEED;
                        // 'active' 노트만 미스 판정
                        if (note.state === 'active' && newY > CLICK_ZONE_Y + JUDGEMENT_TOLERANCE) {
                            missesInThisFrame++;
                            return { ...note, y: newY, state: 'missed' };
                        }
                        // 모든 노트 이동
                        return { ...note, y: newY };
                    })
                    // 'missed' 또는 'hit' 상태이면서 화면 밖으로 나간 노트만 제거
                    .filter(note => !(note.state === 'hit' && note.y > 730) && !(note.state === 'missed' && note.y > 730)); 
                
                // ref를 즉시 업데이트
                notesRef.current = updatedNotes;
                return updatedNotes;
            });

            if (missesInThisFrame > 0) {
                pendingMisses.current += missesInThisFrame;
                handleJudgement('fail');
            }

            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };

        gameLoopRef.current = requestAnimationFrame(gameLoop);

        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [handleJudgement]);

    useEffect(() => {
        if (pendingMisses.current > 0) {
            setLives(prev => Math.max(0, prev - pendingMisses.current));
            pendingMisses.current = 0;
        }
    }, [notes]);

    /**
     * @description 레인 클릭/버튼 입력 처리 (마우스, 라즈베리파이 모두 사용)
     * @param {number} laneIndex 0부터 4까지의 레인 인덱스
     */
    const handleLaneClick = useCallback((laneIndex) => {
        if (livesRef.current === 0) return;

        // 🟢 디버깅 로그 추가: 어떤 레인이 눌렸는지 즉시 확인
        console.log(`[입력 감지] 레인: ${laneIndex}`); 

        // 최신 notes 상태를 ref에서 가져옴
        const currentNotes = notesRef.current;
        const noteIndexToJudge = currentNotes.findIndex(note =>
            note.lane === laneIndex &&
            note.state === 'active' && // 활성 상태의 노트만 판정
            note.y >= CLICK_ZONE_Y - JUDGEMENT_TOLERANCE &&
            note.y <= CLICK_ZONE_Y + JUDGEMENT_TOLERANCE
        );

        if (noteIndexToJudge !== -1) {
            // **[성공 판정]**
            console.log(`[판정 성공] 레인: ${laneIndex}, Y 위치: ${currentNotes[noteIndexToJudge].y}`); 
            setScore(prev => prev + 100);
            handleJudgement('perfect');
            
            // 노트를 'hit' 상태로 변경하여 gameLoop에서 미스 처리되는 것을 즉시 방지
            const updatedNotes = currentNotes.map((note, index) => 
                index === noteIndexToJudge ? { ...note, state: 'hit' } : note
            );

            // Ref와 State를 동시에 업데이트하여 다음 입력이 최신 상태를 참조하도록 보장
            notesRef.current = updatedNotes; 
            setNotes(updatedNotes); 
            
        } else {
            // **[실패 판정]**
            const checkNote = currentNotes.find(note => note.lane === laneIndex && note.state === 'active');
            if (checkNote) {
                console.log(`[판정 실패] 노트 존재, 레인: ${laneIndex}, 현재 Y 위치: ${checkNote.y}, 판정 범위: ${CLICK_ZONE_Y - JUDGEMENT_TOLERANCE}~${CLICK_ZONE_Y + JUDGEMENT_TOLERANCE}`);
            } else {
                console.log(`[판정 실패] 레인: ${laneIndex}, 활성 노트 없음`);
            }
            
            handleJudgement('fail');
            setLives(prev => Math.max(0, prev - 1));
        }
    }, [handleJudgement]); 

    const handleCloseModal = () => {
        navigate('/std/main');
    };

    // 🔥 라즈베리파이 WebSocket 연결 및 거북이 게임과 동일한 매핑 적용
    useEffect(() => {
        // 거북이 게임의 REVERSE_MAPPING과 동일합니다.
        // 서버 버튼 번호 (Server's Output): 3, 1, 4, 2, 5
        // 리듬 게임 레인 인덱스 (0~4)로 변환: 0, 1, 2, 3, 4
        const REVERSE_MAPPING = {
            3: 0, // 버튼 3 -> 레인 인덱스 0 (화면상 1번째 레인)
            1: 1, // 버튼 1 -> 레인 인덱스 1 (화면상 2번째 레인)
            4: 2, // 버튼 4 -> 레인 인덱스 2 (화면상 3번째 레인)
            2: 3, // 버튼 2 -> 레인 인덱스 3 (화면상 4번째 레인)
            5: 4, // 버튼 5 -> 레인 인덱스 4 (화면상 5번째 레인)
        };
        
        const ws = new WebSocket('ws://10.150.1.242:8765');

        ws.onopen = () => {
            console.log('라즈베리파이 연결됨 (음악 게임 - 최종)');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'button_press') {
                    const buttonNumber = data.button; 
                    
                    // 1. REVERSE_MAPPING을 사용하여 레인 인덱스 (0~4)로 변환
                    const laneIndex = REVERSE_MAPPING[buttonNumber]; 

                    if (laneIndex !== undefined) {
                         // 2. 🔥 변환된 인덱스를 handleLaneClick에 전달
                        handleLaneClick(laneIndex); 
                        console.log(`[버튼 매핑] 서버 버튼: ${buttonNumber} -> 레인 인덱스: ${laneIndex}`);
                    } else {
                        console.error(`매핑되지 않은 버튼 번호 수신: ${buttonNumber}`);
                    }
                }
            } catch (error) {
                 console.error('WebSocket 메시지 파싱 오류:', error, event.data);
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
                {/* 마우스 클릭 시에도 라즈베리파이와 동일하게 0~4 인덱스를 사용 */}
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