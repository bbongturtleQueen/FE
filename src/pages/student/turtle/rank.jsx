import React, { useState, useEffect } from 'react';
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
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserNickname = localStorage.getItem('studentId') || '';

  // 랭킹 조회 API 호출
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ppang/kid/ranking`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.rank && Array.isArray(data.rank)) {
          // rank 배열을 순위 형태로 변환
          const formattedRankings = data.rank.map((item, index) => ({
            rank: index + 1,
            name: item.id,
            score: item.score
          }));
          setRankings(formattedRankings);
        }
      } catch (err) {
        console.error('랭킹 조회 API 오류:', err);
        alert('랭킹을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []); 

  const handleClose = () => {
    window.location.href = '/std/main';
  };

  return (
    <Container>
      <ModalBox>
        <CloseButton onClick={handleClose}>×</CloseButton>
        <Title>🏆 거북이 등딱지 순위</Title>

        <RankingList>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#888' }}>랭킹 불러오는 중...</p>
          ) : rankings.length > 0 ? (
            rankings.map((player) => {
              const isMe = player.name === currentUserNickname;

              return (
                <RankingItem key={player.rank} isMe={isMe}>
                  <RankBadge rank={player.rank}>{player.rank}위</RankBadge>
                  <PlayerInfo>
                    <PlayerName isMe={isMe}>
                      {player.name}
                    </PlayerName>
                    <Score isMe={isMe}>{player.score}점</Score>
                  </PlayerInfo>
                </RankingItem>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>아직 랭킹 정보가 없습니다.</p>
          )}
        </RankingList>
      </ModalBox>
    </Container>
  );
}