import React, { useState } from 'react';
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

export default function StdMain() {
  const navigate = useNavigate();
  const games = [
    {
      id: 'turtle1',
      icon: TurtleIcon,
      title: '1학년 1반 수학 대결',
      description: '가장 많이 맞춘 친구!!!! 매점',
      route: '/tch/entercode'
    },
    {
      id: 'turtle2',
      icon: TurtleIcon,
      title: '1학년 2반 수학 대결',
      description: '가장 많이 맞춘 친구!!!! 매점',
      route: '/tch/entercode'
    },
    {
      id: 'turtle3',
      icon: TurtleIcon,
      title: '1학년 3반 수학 대결',
      description: '가장 많이 맞춘 친구!!!! 매점',
      route: '/tch/entercode'
    },
    {
      id: 'turtle4',
      icon: TurtleIcon,
      title: '1학년 4반 수학 대결',
      description: '가장 많이 맞춘 친구!!!! 매점',
      route: '/tch/entercode'
    }

  ];
  const handleGameClick = (game) => {
    navigate(game.route);
  };

  return (
    <Container>
      
      <Title>아이들에게 공유할 세트를 하나 골라요</Title>
      
      <GameGrid>
        {games.map((game) => (
          <GameCard key={game.id} onClick={() => handleGameClick(game)}>
            <GameIcon>
              {game.icon && <img src={game.icon} alt={game.title} />}
            </GameIcon>
            <GameInfo>
              <GameTitle>{game.title}</GameTitle>
              <GameDescription>{game.description}</GameDescription>
            </GameInfo>
          </GameCard>
        ))}
      </GameGrid>
    </Container>
  );
}