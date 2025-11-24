import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #9DB6AF;
`;

const ModalBox = styled.div`
  width: 600px;
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 40px;
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

  &:hover {
    color: #000000;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 30px;
`;

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    margin-left: 12px;
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F3F4F6;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 4px;
  }
`;

const RankingItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 28px;
  margin-right: 16px;

  background-color: ${props => props.isMe ? '#DCFFE3' : 'transparent'}; 
  border: 2px solid ${props => props.isMe ? 'transparent' : '#DCFFE3'};
  border-radius: 12px;
  gap: 16px;
`;

const RankBadge = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${props => props.rank <= 3 ? 'transparent' : 'transparent'};
  border: 2px solid ${props => props.rank <= 3 ? '#E5E7EB' : '#E5E7EB'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.rank === 1 ? '#9CA3AF' : props.rank === 2 ? '#9CA3AF' : props.rank === 3 ? '#9CA3AF' : '#9CA3AF'};
`;

const PlayerInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PlayerName = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.isMe ? '#000000' : '#000000'}; 
`;

const Score = styled.span`
  font-size: 16px;
  color: ${props => props.isMe ? '#9CA3AF' : '#9CA3AF'};
`;

export default function Rank() {
  const rankings = [
    { rank: 1, classNum: 1414, name: '이은채', score: 10 },
    { rank: 2, classNum: 1411, name: '윤미수', score: 9 },
    { rank: 3, classNum: 1305, name: '김지은', score: 9 },
    { rank: 4, classNum: 1314, name: '임소리', score: 8 },
    { rank: 5, classNum: 1410, name: '양선미', score: 7 },
    { rank: 6, classNum: 1302, name: '김주연', score: 6 }
  ];
  const currentUserNickname = '윤미수'; 

  const handleClose = () => {
    window.location.href = '/std/main';
  };

  return (
    <Container>
      <ModalBox>
        <CloseButton onClick={handleClose}>×</CloseButton>
        <Title>거북이 등딱지 순위</Title>
        
        <RankingList>
          {rankings.map((player) => {
            const isMe = player.name === currentUserNickname;

            return (
              <RankingItem key={player.rank} isMe={isMe}>
                <RankBadge rank={player.rank}>{player.rank}위</RankBadge>
                <PlayerInfo>
                  <PlayerName isMe={isMe}>
                    {player.classNum} {player.name}
                  </PlayerName>
                  <Score isMe={isMe}>{player.score}/10</Score>
                </PlayerInfo>
              </RankingItem>
            );
          })}
        </RankingList>
      </ModalBox>
    </Container>
  );
}