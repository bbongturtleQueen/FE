import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import EmptyHeartImg from '../../../assets/emptyheart.png';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E3FFE9;
`;

const HeartWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const Heart = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 0px;
`;

const SubText = styled.p`
  font-size: 22px;
  color: #858585;
`;

export default function GameOver() {
  const location = useLocation();
  const score = location.state?.score || 0;

  // 점수 저장 API 호출
  useEffect(() => {
    const saveScore = async () => {
      try {
        const userId = localStorage.getItem('studentId');

        if (!userId) {
          console.error('Student ID not found');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/ppang/kid/save-score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            score: score
          })
        });

        const data = await response.json();

        if (data.status === 'success') {
          console.log('점수 저장 완료:', data);
        } else {
          console.error('점수 저장 실패:', data);
        }
      } catch (err) {
        console.error('점수 저장 API 오류:', err);
      }
    };

    saveScore();
  }, [score]);

  return (
    <Container>
      <HeartWrapper>
        <Heart src={EmptyHeartImg} alt="empty heart" />
        <Heart src={EmptyHeartImg} alt="empty heart" />
        <Heart src={EmptyHeartImg} alt="empty heart" />
      </HeartWrapper>
      <Title>모든 하트가 소멸 되었어요ㅠㅠ</Title>
      <SubText>다른 친구들 모두가 게임이 끝날 때까지 기다려주세요!</SubText>
      <SubText>내 점수: {score}점</SubText>
    </Container>
  );
}