import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ExplainModal from '../../components/explainmodal.jsx';
import LogoImg from '../../assets/logo.png';
import TurtleIcon from '../../assets/turtle.png';
import RememberIcon from '../../assets/remember.png';
import MoleIcon from '../../assets/mole.png';
import MusicIcon from '../../assets/music.png';

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

const LogoContainer = styled.div`
  width: 167px;
`;

const Logo = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const SubTitle = styled.p`
  font-size: 20px;
  color: #858585;
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
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'turtle',
      icon: TurtleIcon,
      title: '거북이 등딱지',
      description: '"수학 싫어!" 어린이들에게,\n재미있게 공부해요!',
      modalDescription: '먼저, 선생님이 주신 초대코드로 클래스에 들어가요\n게임처럼 수학 문제를 풀고 답을 찾아 버튼을 눌러요!\n같은 클래스 안의 친구들과 대결해서 순위도 나눌 수 있어요\n1등을 하면 좋은 상품이 있을지도~~?',
      route: '/std/turtle/entercode'
    },
    {
      id: 'remember',
      icon: RememberIcon,
      title: '기억하자',
      description: '거북이가 어디에 있었는지\n기억했다가 눌러봐요!',
      modalDescription: '기억하자는 어린이들의 기억력을 높여주는 게임이에요\n화면에 나타나는 거북이 순서대로 버튼을 누르는 게임!\n틀리면 처음으로 다시 돌아가요!\n우리 한번 도전 해볼까요?',
      route: '/std/memory/ready'
    },
    {
      id: 'mole',
      icon: MoleIcon,
      title: '두.. 때리기',
      description: '하나씩 올라오는 두더지를\n때려 잡아요!',
      modalDescription: '땅에서 올라오는 두더지를 눌러요\n버튼을 팡!하고 때리면 두더지가 두... 하고 들어간답니다!\n두더지가 두.. 하면 점수 +1~~!\n지금 당장 두더지를 때려 잡아봐요!!!!',
      route: '/std/mole/ready'
    },
    {
      id: 'rhythm',
      icon: MusicIcon,
      title: '핑핑! 뾰로롱',
      description: '리듬 게임!\n리듬에 따라 박자를 맞춰요',
      modalDescription: '게임이 시작되면 노래에 맞춰 음표들이 내려와요\n그리고 박자에 맞춰서 버튼을 눌러요!\n한번 누를때마다 핑!핑! 소리가 나고\n게임이 끝나면 뾰로롱~! 소리가 난답니다!!',
      route: '/std/music/ready'
    }
  ];

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleStart = () => {
    if (selectedGame) {
      navigate(selectedGame.route);
    }
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  return (
    <Container>
      <LogoContainer>
        <Logo src={LogoImg} alt="뿅!거북팡 로고" />
      </LogoContainer>
      
      <SubTitle>'뿅!거북팡'에 온 걸 환영해요, 하고 싶은 게임을 하나 골라요!</SubTitle>
      
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

      {selectedGame && (
        <ExplainModal
          gameName={selectedGame.title}
          icon={selectedGame.icon}
          description={selectedGame.modalDescription}
          onStart={handleStart}
          onClose={handleCloseModal}
        />
      )}
    </Container>
  );
}