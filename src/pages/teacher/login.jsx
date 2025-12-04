import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #9DB6AF;
`;

const LoginBox = styled.div`
  width: 500px;
  background-color: #FFFFFF;
  border-radius: 24px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 400px;
  padding: 16px 20px;
  border: 1px solid #B4B4B4;
  background-color: #ffffff;
  border-radius: 10px;
  font-size: 18px;
  margin-bottom: 16px;
  color: #009A73;
  &:-webkit-autofill,
  &:-webkit-autofill:hover, 
  &:-webkit-autofill:focus, 
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important; 
    transition: background-color 5000s ease-in-out 0s;
    -webkit-text-fill-color: #009A73 !important;
  }
  &:focus {
    outline: none;
    border-color: #22C55E;
    color: #009A73;
  }

  &::placeholder {
    color: #B4B4B4;
  }
`;

const ErrorMessage = styled.p`
  color: #EF4444;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
`;

const LoginButton = styled.button`
  width: 460px;
  padding: 20px;
  background-color: ${props => props.disabled ? '#D7D7D7' : '#4ADE80'};
  border: none;
  border-radius: 30px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-top: 24px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.disabled ? '#D7D7D7' : '#22C55E'};
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const isFormValid = () => {
    return formData.id && formData.password;
  };

  const handleLogin = async () => {
    setLoading(true);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ppang/tch/turtle/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          password: formData.password
        })
      });
  
      const data = await response.json();
  
      if (data.status === 'success') {
        localStorage.setItem('teacherId', formData.id);
        alert('로그인 성공!');
        navigate('/tch/ready');
      } else if (data.status === 'wrong_password') {
        setError('비밀번호가 틀렸어요!');
      } else if (data.status === 'not_found') {
        setError('존재하지 않는 아이디예요!');
      }
    } catch (err) {
      console.error('API 에러:', err);
      setError('서버 연결에 실패했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>로그인</Title>

        <Input
          type="text"
          name="id"
          placeholder="아이디를 입력하세요.."
          value={formData.id}
          onChange={handleChange}
          autoComplete="off"
        />

        <Input
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요.."
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginButton 
          onClick={handleLogin} 
          disabled={!isFormValid() || loading}
        >
          {loading ? '처리 중...' : '로그인 하기'}
        </LoginButton>
      </LoginBox>
    </Container>
  );
}