import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ContentModal from '../../../components/contentmodal.jsx';

// ⚠️ 웹소켓 주소는 이제 필요하지 않지만, API 주소의 베이스를 위해
// 환경 변수를 사용하거나 (VITE_API_URL) 직접 정의해야 합니다.
// 여기서는 `import.meta.env.VITE_API_URL`을 사용한다고 가정합니다.

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

// 주석 처리된 WEBSOCKET_HOST 대신 API URL 사용 가정
// const WEBSOCKET_HOST = "ws://localhost:8000"; 

export default function TurtleEnterCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  
  // ⚠️ 웹소켓을 사용하지 않으므로 wsRef는 더 이상 필요하지 않습니다. 제거합니다.
  // const wsRef = useRef(null); 
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
        // 🌟 1. /ppang/kid/enter-code API를 사용하여 코드 유효성 검사
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ppang/kid/enter-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: fullCode,
                // 백엔드 명세에 'id'가 포함되어 있지만, 닉네임은 다음 페이지에서 입력하므로
                // 여기서는 임시 값이나 빈 값을 보냅니다. (명세에 맞춰 일단 "temp_kid"를 사용)
                id: "temp_kid" 
            })
        });

        const data = await response.json();

        // 🌟 2. 응답 상태에 따라 처리
        if (data.status === 'valid') {
            // 유효한 코드: 닉네임 페이지로 이동 (코드를 state로 넘김)
            navigate('/std/turtle/nickname', { state: { inviteCode: fullCode } }); 
        } else if (data.status === 'invalid') {
            // 무효한 코드
            setError('없는 클래스예요! 코드를 다시 적어볼까요?');
            setCode(['', '', '', '', '', '']);
            document.getElementById('code-0').focus();
        } else {
            // 기타 서버 응답 오류
            setError('클래스 확인 중 오류가 발생했어요. 서버 상태를 확인해주세요.');
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
        onClose={() => {}}
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