import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Turtle from '../../assets/turtle.png';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  background-color: #E3FFE9;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 40px;
`;

const SetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
`;

const SetCard = styled.div`
  display: flex;
  align-items: center;
  padding: 30px;
  background-color: #FFFFFF;
  border: 2px solid #D1D5DB;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const SetIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 24px;
`;

const SetInfo = styled.div`
  flex: 1;
`;

const SetName = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 8px;
`;

const SetDescription = styled.p`
  font-size: 16px;
  color: #858585;
  line-height: 1.5;
`;

export default function ChooseSet() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSets();
  }, []);

  const loadSets = async () => {
    const teacherId = localStorage.getItem('teacherId');
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ppang/tch/chooseset?teacher_id=${teacherId}`
      );
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setSets(data.sets);
      }
    } catch (err) {
      console.error('API 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetClick = (setId) => {
    // 세트 선택하면 게임 시작
    navigate(`/tch/entercode?set_id=${setId}`);
  };

  return (
    <Container>
      <Title>아이들에게 공유할 세트를 하나 골라요</Title>
      
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <SetGrid>
          {sets.map((set) => (
            <SetCard key={set.set_id} onClick={() => handleSetClick(set.set_id)}>
              <SetIcon src={Turtle} alt="turtle" />
              <SetInfo>
                <SetName>{set.set_name}</SetName>
                <SetDescription>{set.description}</SetDescription>
              </SetInfo>
            </SetCard>
          ))}
        </SetGrid>
      )}
    </Container>
  );
}