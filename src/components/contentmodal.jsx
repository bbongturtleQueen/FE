import React from 'react';
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
  width: 500px;
  background-color: #FFFFFF;
  border-radius: 24px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubmitButton = styled.button`
  width: 460px;
  padding: 20px;
  background-color: ${props => props.disabled ? '#D7D7D7' : '#4ADE80'};
  border: none;
  border-radius: 30px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.disabled ? '#D7D7D7' : '#22C55E'};
  }
`;

export default function ContentModal({ children, buttonText, onSubmit, onClose, disabled }) {
  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        {children}
        
        <SubmitButton onClick={onSubmit} disabled={disabled}>
          {buttonText}
        </SubmitButton>
      </ModalBox>
    </Overlay>
  );
}