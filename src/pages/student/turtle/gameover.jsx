import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EmptyHeartImg from '../../../assets/emptyheart.png';
import HeartImg from '../../../assets/fillheart.png';
import HomeIcon from '../../../assets/home.svg';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E3FFE9;
  position: relative;
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
  font-size: 28px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 0px;
`;

const SubText = styled.p`
  font-size: 50px;
  font-weight: bold;
  color: #009A73;
  margin-top: 12px;
`;

const HomeButton = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  cursor: pointer;
`;

export default function GameOver() {
  const location = useLocation();
  const navigate = useNavigate();

  const score = location.state?.score || 0;
  const endReason = location.state?.endReason || 'livesZero';
  const nickname = location.state?.nickname || localStorage.getItem('studentId') || "플레이어";

  const message = endReason === 'allSolved'
    ? `"${nickname} 학생, 완벽해요! 정말 잘했어요!!"`
    : `"${nickname} 학생.. 모든 하트가 소멸 되었어요ㅠㅠ"`;

  const heartImage = endReason === 'allSolved' ? HeartImg : EmptyHeartImg; // ✅ 조건에 따른 이미지 선택

  useEffect(() => {
    const saveScore = async () => {
      try {
        const userId = localStorage.getItem('studentId');
        if (!userId) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/ppang/kid/save-score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, score })
        });

        const data = await response.json();
        if (data.status === 'success') console.log('점수 저장 완료:', data);
        else console.error('점수 저장 실패:', data);
      } catch (err) {
        console.error('점수 저장 API 오류:', err);
      }
    };

    saveScore();
  }, [score]);

  const handleGoHome = () => navigate('/std/main');

  return (
    <Container>
      <HomeButton src={HomeIcon} alt="home" onClick={handleGoHome} />
      <HeartWrapper>
        <Heart src={heartImage} alt="heart" />
        <Heart src={heartImage} alt="heart" />
        <Heart src={heartImage} alt="heart" />
      </HeartWrapper>
      <Title>{message}</Title>
      <SubText>SCORE: {score}</SubText>
    </Container>
  );
}
