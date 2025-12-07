import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TurtleIcon from '../../assets/turtle.png';

const Container = styled.div`
  width: 1040px;
  height: 630px;
  display: flex;
  flex-direction: column;
  padding: 50px 70px 50px 70px;
  background-color: #E3FFE9;
  position: relative;
  overflow: hidden;
`;

const Title = styled.p`
  font-size: 30px;
  font-weight: bold;
  color:rgb(0, 0, 0);
  margin-bottom: 40px;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 486px 486px;
  gap: 60px;
  width: 100%;
`;

const GameCard = styled.div`
  display: flex;
  width: 100%;
  height: 187px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background-color:rgb(236, 255, 239);
  border: 2px solid #B4B4B4;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    background-color: transparent;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const GameIcon = styled.div`
  width: 143px;
  height: 137px;
  margin-right: 40px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const GameInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const GameTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #1d1d1d;
  margin-bottom: 0px;
`;

const GameDescription = styled.p`
  font-size: 18px;
  color: #858585;
  line-height: 1.5;
  white-space: pre-line;
`;

export default function ChooseSet() {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 선생님이 만든 세트 목록 가져오기
  useEffect(() => {
    const fetchSets = async () => {
      try {
        const teacherId = localStorage.getItem('teacherId');

        if (!teacherId) {
          console.error('Teacher ID not found');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/ppang/set/list/${teacherId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.status === 'success' && data.sets) {
          setSets(data.sets);
        } else {
          console.error('세트 목록 가져오기 실패:', data);
        }
      } catch (err) {
        console.error('세트 목록 API 오류:', err);
        alert('세트 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  const handleGameClick = (set) => {
    // 세트를 선택하면 해당 세트 정보를 저장하고 entercode로 이동
    localStorage.setItem('selectedSetId', set.id);
    localStorage.setItem('selectedSetName', set.name);
    navigate('/tch/entercode');
  };

  return (
    <Container>
      <Title>아이들에게 공유할 세트를 하나 골라요</Title>

      <GameGrid>
        {loading ? (
          <p style={{ gridColumn: '1 / span 2', textAlign: 'center', color: '#888' }}>
            세트 목록 불러오는 중...
          </p>
        ) : sets.length > 0 ? (
          sets.map((set) => (
            <GameCard key={set.id} onClick={() => handleGameClick(set)}>
              <GameIcon>
                <img src={TurtleIcon} alt={set.name} />
              </GameIcon>
              <GameInfo>
                <GameTitle>{set.name}</GameTitle>
                <GameDescription>{set.description || '문제 세트'}</GameDescription>
              </GameInfo>
            </GameCard>
          ))
        ) : (
          <p style={{ gridColumn: '1 / span 2', textAlign: 'center', color: '#888' }}>
            아직 만든 문제 세트가 없습니다. 문제를 만들어주세요!
          </p>
        )}
      </GameGrid>
    </Container>
  );
}