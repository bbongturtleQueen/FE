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
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    const fullCode = code.join('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ppang/kid/enter-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: fullCode,  
          id: ""  // ⭐ 첫 번째 호출에서는 id 절대 넣지 않기!
        })
      });

      const data = await response.json();

      if (data.status === 'valid') {
        navigate('/std/turtle/nickname', {
          state: { inviteCode: fullCode }
        });
      } else if (data.status === 'invalid') {
        setError('없는 클래스예요! 코드를 다시 적어볼까요?');
        setCode(['', '', '', '', '', '']);
        document.getElementById('code-0').focus();
      } else {
        setError('클래스 확인 중 오류가 발생했어요.');
      }

    } catch (err) {
      console.error('API Error:', err);
      setError('서버 연결에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <Container>
      <ContentModal
        buttonText={loading ? '확인 중...' : '클래스 참가하기'}
        onSubmit={handleSubmit}
        disabled={!isCodeComplete || loading}
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
              disabled={loading}
            />
          ))}
        </CodeInputWrapper>
      </ContentModal>
    </Container>
  );
}
