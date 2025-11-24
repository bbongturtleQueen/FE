import React, { useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  width: 1000px;
  max-height: 650px;
  background-color: #FFFFFF;
  border-radius: 24px;
  padding: 50px;
  display: flex;
  flex-direction: column;
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
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 16px;
`;

const SetNameInput = styled.input`
  width: 100%;
  padding: 14px 20px;
  border: 2px solid #D1D5DB;
  border-radius: 12px;
  font-size: 16px;
  margin-bottom: 30px;

  &:focus {
    outline: none;
    border-color: #22C55E;
  }

  &::placeholder {
    color: #B4B4B4;
  }
`;

const SubTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 8px;
`;

const Instruction = styled.p`
  font-size: 14px;
  color: #B4B4B4;
  margin-bottom: 20px;
`;

const ProblemScrollArea = styled.div`
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 20px;
  
  &::-webkit-scrollbar {
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

const ProblemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const ProblemNumber = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #22C55E;
  min-width: 35px;
`;

const InputBox = styled.input`
  width: 60px;
  padding: 8px;
  border: 2px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #22C55E;
  }

  &::placeholder {
    color: #D1D5DB;
    font-size: 12px;
  }
`;

const OperatorSelect = styled.select`
  width: 70px;
  padding: 8px;
  border: 2px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #22C55E;
  }
`;

const Label = styled.span`
  font-size: 14px;
  color: #6B7280;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: transparent;
  border: 2px dashed #D1D5DB;
  border-radius: 12px;
  color: #B4B4B4;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    border-color: #22C55E;
    color: #22C55E;
  }
`;

const NextButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: ${props => props.disabled ? '#D1D5DB' : '#4ADE80'};
  border: none;
  border-radius: 30px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    background-color: ${props => props.disabled ? '#D1D5DB' : '#22C55E'};
  }
`;

export default function ProblemModal({ onClose, onSubmit }) {
  const [setName, setSetName] = useState('');
  const [problems, setProblems] = useState([
    { num1: '', operator: '+', num2: '', answer: '', options: ['', '', '', ''] }
  ]);

  const handleAddProblem = () => {
    setProblems([
      ...problems,
      { num1: '', operator: '+', num2: '', answer: '', options: ['', '', '', ''] }
    ]);
  };

  const handleProblemChange = (index, field, value) => {
    const newProblems = [...problems];
    newProblems[index][field] = value;
    setProblems(newProblems);
  };

  const handleOptionChange = (problemIndex, optionIndex, value) => {
    const newProblems = [...problems];
    newProblems[problemIndex].options[optionIndex] = value;
    setProblems(newProblems);
  };

  const isFormValid = () => {
    if (!setName.trim()) return false;
    return problems.every(p => 
      p.num1 && p.num2 && p.answer && p.options.every(opt => opt !== '')
    );
  };

  const handleNext = () => {
    onSubmit({ setName, problems });
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <Title>문제 세트의 이름을 적어요</Title>
        <SetNameInput
          type="text"
          placeholder="ex) 덧셈과 뺄셈 문제"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
        />

        <SubTitle>문제를 만들어요</SubTitle>
        <Instruction>
          기호는 이렇게 입력해요! (덧셈: +, 뺄셈: -, 곱셈: *, 나눗셈: /)
        </Instruction>

        <ProblemScrollArea>
          {problems.map((problem, index) => (
            <ProblemRow key={index}>
              <ProblemNumber>{String(index + 1).padStart(2, '0')}.</ProblemNumber>
              
              <InputBox
                type="number"
                placeholder="ex) 3"
                value={problem.num1}
                onChange={(e) => handleProblemChange(index, 'num1', e.target.value)}
              />
              
              <OperatorSelect
                value={problem.operator}
                onChange={(e) => handleProblemChange(index, 'operator', e.target.value)}
              >
                <option value="+">ex) +</option>
                <option value="-">-</option>
                <option value="*">*</option>
                <option value="/">/</option>
              </OperatorSelect>
              
              <InputBox
                type="number"
                placeholder="ex) 5"
                value={problem.num2}
                onChange={(e) => handleProblemChange(index, 'num2', e.target.value)}
              />
              
              <Label>=</Label>
              
              <InputBox
                type="number"
                placeholder="ex) 8"
                value={problem.answer}
                onChange={(e) => handleProblemChange(index, 'answer', e.target.value)}
              />
              
              <Label> &gt; 보기</Label>
              
              {problem.options.map((option, optIndex) => (
                <InputBox
                  key={optIndex}
                  type="number"
                  placeholder={`ex) ${[2, 20, 9, 15][optIndex]}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                />
              ))}
            </ProblemRow>
          ))}
        </ProblemScrollArea>
        
        <AddButton onClick={handleAddProblem}>
          문제 추가하기
        </AddButton>

        <NextButton onClick={handleNext} disabled={!isFormValid()}>
          다음으로 넘어가기
        </NextButton>
      </ModalBox>
    </Overlay>
  );
}