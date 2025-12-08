import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ContentModal from '../../../components/contentmodal.jsx';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E3FFE9;
`;

const Title = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
`;

const ErrorMessage = styled.p`
  color: #EF4444;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 12px;
`;

const CodeInputWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
`;

const CodeInput = styled.input`
  width: 50px;
  height: 60px;
  border: 2px solid #B4B4B4;
  border-radius: 10px;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #009A73;

  &:focus {
    outline: none;
    border-color: #22C55E;
  }
`;

export default function TurtleEnterCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError('');

      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    setError('');

    // 090318 코드 확인
    if (fullCode === '090318') {
      navigate('/std/turtle/nickname', {
        state: { inviteCode: fullCode }
      });
    } else {
      setError('없는 클래스예요! 코드를 다시 적어볼까요?');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0').focus();
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <Container>
      <ContentModal
        buttonText="클래스 참가하기"
        onSubmit={handleSubmit}
        disabled={!isCodeComplete}
      >
        <Title>선생님이 주신 초대코드를 적고 들어가요!</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <CodeInputWrapper>
          {code.map((digit, index) => (
            <CodeInput
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              autoComplete="off"
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </CodeInputWrapper>
      </ContentModal>
    </Container>
  );
}
