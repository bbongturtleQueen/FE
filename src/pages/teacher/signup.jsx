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

const SignupBox = styled.div`
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

const SignupButton = styled.button`
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

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  console.log(import.meta.env.VITE_API_URL);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // 입력하면 에러 메시지 지우기
  };

  const isFormValid = () => {
    return formData.id && 
           formData.password && 
           formData.confirmPassword &&
           formData.password === formData.confirmPassword;
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않아요!');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ppang/tch/turtle/signup`, {
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
        alert('회원가입이 완료되었어요!');
        navigate('/tch/login');
      } else if (data.status === 'error') {
        setError(data.message || '회원가입에 실패했어요!');
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
      <SignupBox>
        <Title>회원가입</Title>

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
          autoComplete="new-password"
        />

        <Input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력하여 확인하세요.."
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SignupButton 
          onClick={handleSignup} 
          disabled={!isFormValid() || loading}
        >
          {loading ? '처리 중...' : '회원가입 완료'}
        </SignupButton>
      </SignupBox>
    </Container>
  );
}