import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ResultModal from '../../../components/ResultModal';
import HeartImg from '../../../assets/fillheart.png';
import EmptyHeartImg from '../../../assets/emptyheart.png';
import TurtleImg from '../../../assets/exampleTurtle.png';
import BgImg from '../../../assets/turtlebg.png';

import Num0 from '../../../assets/number/0.png';
import Num1 from '../../../assets/number/1.png';
import Num2 from '../../../assets/number/2.png';
import Num3 from '../../../assets/number/3.png';
import Num4 from '../../../assets/number/4.png';
import Num5 from '../../../assets/number/5.png';
import Num6 from '../../../assets/number/6.png';
import Num7 from '../../../assets/number/7.png';
import Num8 from '../../../assets/number/8.png';
import Num9 from '../../../assets/number/9.png';

import Ex0 from '../../../assets/number/ex0.png';
import Ex1 from '../../../assets/number/ex1.png';
import Ex2 from '../../../assets/number/ex2.png';
import Ex3 from '../../../assets/number/ex3.png';
import Ex4 from '../../../assets/number/ex4.png';
import Ex5 from '../../../assets/number/ex5.png';
import Ex6 from '../../../assets/number/ex6.png';
import Ex7 from '../../../assets/number/ex7.png';
import Ex8 from '../../../assets/number/ex8.png';
import Ex9 from '../../../assets/number/ex9.png';

// 기호 이미지 import
import PlusImg from '../../../assets/number/plus.png';
import MinusImg from '../../../assets/number/minus.png';
import MultiplyImg from '../../../assets/number/multiply.png';
import DivideImg from '../../../assets/number/divide.png';
import EqualsImg from '../../../assets/number/equal.png';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  background-image: url(${BgImg});
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
`;

const HeartWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 30px;
  display: flex;
  gap: 8px;
`;

const Heart = styled.img`
  width: 50px;
  height: 42px;
`;

const ProgressText = styled.div`
  position: absolute;
  top: 160px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: bold;
  color: #56CF6E;
`;

const QuestionBox = styled.div`
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 150px;
  background-color: transparent;
  border: 3px solid #b2b2b2;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
`;

const NumberWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NumberImg = styled.img`
  height: 70px;
  object-fit: contain;
`;

const SymbolImg = styled.img`
  width: 40px;
  object-fit: contain;
`;

const AnswerGrid = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0px;
`;

const AnswerButton = styled.button`
  width: 220px;
  height: 200px;
  background-image: url(${TurtleImg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:nth-child(even) {
    margin-top: -90px;
  }

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const AnswerNumberWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 46%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 4px;
  align-items: center;
  background-color: transparent;
`;

const AnswerNumberImg = styled.img`
  height: 45px;
  align-items: center;
  object-fit: contain;
  background-color: transparent;
`;

export default function TurtleGame() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const maxLives = 3;

  const numberImages = {
    0: Num0, 1: Num1, 2: Num2, 3: Num3, 4: Num4,
    5: Num5, 6: Num6, 7: Num7, 8: Num8, 9: Num9
  };

  const exNumberImages = {
    0: Ex0, 1: Ex1, 2: Ex2, 3: Ex3, 4: Ex4,
    5: Ex5, 6: Ex6, 7: Ex7, 8: Ex8, 9: Ex9
  };

  const symbolImages = {
    '+': PlusImg,
    '-': MinusImg,
    '×': MultiplyImg,
    '/': DivideImg,
    '=': EqualsImg
  };

  const getNumberImages = (num, isAnswer = false) => {
    const images = isAnswer ? exNumberImages : numberImages;
    return String(num).split('').map(digit => images[digit]);
  };

  const problems = [
    { id: 1, num1: 2, operator: '×', num2: 4, answer: 8, options: [4, 8, 6, 12, 24] },
    { id: 2, num1: 3, operator: '+', num2: 5, answer: 8, options: [6, 7, 8, 9, 10] },
    { id: 3, num1: 10, operator: '-', num2: 3, answer: 7, options: [7, 6, 5, 9, 8] },
    { id: 4, num1: 6, operator: '×', num2: 3, answer: 18, options: [12, 15, 18, 21, 24] },
    { id: 5, num1: 9, operator: '+', num2: 7, answer: 16, options: [14, 15, 17, 16, 18] },
    { id: 6, num1: 20, operator: '-', num2: 8, answer: 12, options: [10, 11, 12, 13, 14] },
    { id: 7, num1: 5, operator: '/', num2: 5, answer: 1, options: [1, 5, 25, 27, 0] },
    { id: 8, num1: 12, operator: '+', num2: 8, answer: 20, options: [18, 19, 22, 21, 20] },
    { id: 9, num1: 15, operator: '-', num2: 6, answer: 9, options: [7, 8, 10, 9, 11] },
    { id: 10, num1: 4, operator: '×', num2: 7, answer: 28, options: [24, 26, 32, 30, 28] }
  ];

  const currentProblem = problems[currentQuestion];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);

    if (answer === currentProblem.answer) {
      setIsCorrect(true);
      setShowResultModal(true);
    } else {
      if (lives > 1) {
        setLives(lives - 1);
        setIsCorrect(false);
        setShowResultModal(true);
      } else {
        setLives(0);
        setTimeout(() => {
          navigate('/std/turtle/gameover');
        }, 1000);
      }
    }
  };

  const handleNextQuestion = () => {
    setShowResultModal(false);
    
    if (lives === 0) {
      navigate('/std/turtle/gameover');
      return;
    }
  
    if (currentQuestion < problems.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      navigate('/std/turtle/rank');
    }
  };

  return (
    <Container>
      <HeartWrapper>
        {[...Array(maxLives)].map((_, i) => (
          <Heart 
            key={i} 
            src={i < lives ? HeartImg : EmptyHeartImg} 
            alt="heart" 
          />
        ))}
      </HeartWrapper>

      <ProgressText>
        {currentQuestion + 1}{`번문제`}
      </ProgressText>

      {/* 문제 */}
      <QuestionBox>
        <NumberWrapper>
          {getNumberImages(currentProblem.num1).map((img, i) => (
            <NumberImg key={`num1-${i}`} src={img} alt="" />
          ))}
        </NumberWrapper>
        
        <SymbolImg src={symbolImages[currentProblem.operator]} alt={currentProblem.operator} />
        
        <NumberWrapper>
          {getNumberImages(currentProblem.num2).map((img, i) => (
            <NumberImg key={`num2-${i}`} src={img} alt="" />
          ))}
        </NumberWrapper>
        
        <SymbolImg src={symbolImages['=']} alt="=" />

        {/* 선택한 답 표시 */}
        {selectedAnswer !== null && (
          <NumberWrapper>
            {getNumberImages(selectedAnswer).map((img, i) => (
              <NumberImg key={`answer-${i}`} src={img} alt="" />
            ))}
          </NumberWrapper>
        )}
      </QuestionBox>

      {/* 답안 버튼 */}
      <AnswerGrid>
        {currentProblem.options.map((option, index) => (
          <AnswerButton 
            key={index} 
            onClick={() => handleAnswer(option)}
            disabled={showResultModal}
          >
            <AnswerNumberWrapper>
              {getNumberImages(option, true).map((img, i) => (
                <AnswerNumberImg key={`ans-${i}`} src={img} alt="" />
              ))}
            </AnswerNumberWrapper>
          </AnswerButton>
        ))}
      </AnswerGrid>

      {/* 정답/오답 모달 */}
      {showResultModal && (
        <ResultModal 
          isCorrect={isCorrect} 
          onNext={handleNextQuestion}
        />
      )}
    </Container>
  );
}