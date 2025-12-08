import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    width: 1040px;
    height: 630px;
    display: flex;
    flex-direction: column;
    padding: 50px 70px 50px 70px;
    background-color: #E3FFE9;
    position: relative;
    overflow: hidden;
    align-items: center;
`;

const ContentBox = styled.div`
    background-color: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 800px;
    text-align: center;
    margin-bottom: 30px;
`;

const InstructionText = styled.p`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
`;

const CodeWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
`;

const InviteCode = styled.span`
    font-size: 90px;
    font-weight: bold;
    color: #4CAF50;
    margin-right: 60px;
`;

const StartButton = styled.button`
    background-color: #D7D7D7;
    color: #858585;
    width: 200px;
    font-size: 16px;
    padding: 12px 30px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #79C27C;
        color: white;
    }
`;

const StudentGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    width: 100%;
    max-width: 800px;
`;

const StudentCard = styled.div`
    background-color: white;
    color: #333;
    padding: 15px 10px;
    border-radius: 8px;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const WEBSOCKET_HOST = "ws://localhost:8000";

export default function EnterCode() {
    const navigate = useNavigate();
    const [inviteCode, setInviteCode] = useState('------');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const wsRef = useRef(null);

    // 방 생성 API 호출
    useEffect(() => {
        const createRoom = async () => {
            try {
                const teacherId = localStorage.getItem('teacherId');

                if (!teacherId) {
                    console.error("Teacher ID not found in localStorage.");
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/ppang/tch/create-room`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // ⭐️ 수정: 백엔드에 맞게 'teacher_id' 사용
                    body: JSON.stringify({ teacher_id: teacherId })
                });

                const data = await response.json();

                // ⭐️ 수정: 백엔드에 맞게 'room_code' 사용
                if (data.status === 'success' && data.room_code) {
                    setInviteCode(data.room_code);
                } else {
                    console.error('방 생성 실패:', data);
                    alert('방 생성에 실패했습니다.');
                }
            } catch (err) {
                console.error('방 생성 API 오류:', err);
                alert('서버 연결에 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        createRoom();
    }, []);

    useEffect(() => {
        if (inviteCode === '------') return;

        const storedTeacherId = localStorage.getItem('teacherId');

        if (!storedTeacherId) {
            console.error("Teacher ID not found in localStorage. Please log in.");
            return;
        }

        const ws = new WebSocket(`${WEBSOCKET_HOST}/ws/classroom-${inviteCode}`);
        wsRef.current = ws;

        let teacherId = storedTeacherId;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                userId: teacherId,
                type: "teacher_join"
            }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "join" || data.type === "leave") {
                // students는 백엔드에서 받은 kid_id 문자열의 배열입니다.
                setStudents(data.list);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        ws.onclose = () => {
            console.log(`WebSocket Disconnected from classroom: ${inviteCode}`);
        };

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [inviteCode]);

    const handleStartGame = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {

            wsRef.current.send(JSON.stringify({
                type: "delete_code",
                code: inviteCode,
            }));

            wsRef.current.send(JSON.stringify({
                type: "start_game",
            }));

            navigate('/tch/game');

        } else {
            console.error("WebSocket is not connected. Cannot start game.");
            navigate('/tch/game');
        }
    };

    return (
        <Container>
            <ContentBox>
                <InstructionText>초대 코드를 학생들에게 안내하세요!</InstructionText>
                <CodeWrapper>
                    <InviteCode>{inviteCode}</InviteCode>
                    <StartButton onClick={handleStartGame}>게임 시작하기</StartButton>
                </CodeWrapper>
            </ContentBox>

            <StudentGrid>
                {students.length > 0 ? (
                    students.map((student) => (
                        // ⭐️ 수정: React 경고 해결 및 백엔드 데이터에 맞게 student 문자열을 key와 내용으로 사용
                        <StudentCard key={student}>
                            {student}
                        </StudentCard>
                    ))
                ) : (
                    <p style={{ gridColumn: '1 / span 4', textAlign: 'center', color: '#888' }}>
                        학생들의 접속을 기다리고 있습니다...
                    </p>
                )}
            </StudentGrid>
        </Container>
    );
}