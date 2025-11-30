import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  width: 260px;
  padding: 24px 24px;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: transparent;
  color: #4ade80;
  border: 3px solid #4ade80;

  &:hover {
    background: #4ade80;
    color: white;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(74, 222, 128, 0.3);
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(74, 222, 128, 0.3);
  }

  &:focus {
    outline: none;
  }
`;

export default function Button({ children, onClick }) {
  return (
    <StyledButton onClick={onClick}>
      {children}
    </StyledButton>
  );
}