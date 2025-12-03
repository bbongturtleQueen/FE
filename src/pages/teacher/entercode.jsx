import React, { useState, useEffect } from 'react';
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


export default function EnterCode() {
    const navigate = useNavigate();
    const [inviteCode, setInviteCode] = useState('------'); 
    const [students, setStudents] = useState([ 
        "1402 권길현", "1410 양선미", "1411 윤미수", "1414 이은채",
        "1414 이은채", "1414 이은채", "1414 이은채", "1414 이은채",
        "1414 이은채", "1414 이은채", "1414 이은채", "1414 이은채",
    ]);

    const generateRandomCode = () => {
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += Math.floor(Math.random() * 10).toString();
        }
        return code;
    };
    useEffect(() => {
        setInviteCode(generateRandomCode());
    }, []); 

    const handleStartGame = () => {
        navigate('/tch/game');
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
                {students.map((student, index) => (
                    <StudentCard key={index}>
                        {student}
                    </StudentCard>
                ))}
            </StudentGrid>
        </Container>
    );
}