import React from 'react';
import styled from 'styled-components';
import ProblemModal from '../../components/problemmodal.jsx';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E3FFE9;
`;

export default function MakeProblem() {
  const handleModalSubmit = (data) => {
    console.log('문제 세트:', data);
  };

  const handleClose = () => {
    window.history.back();
  };

  return (
    <Container>
      <ProblemModal
        onClose={handleClose}
        onSubmit={handleModalSubmit}
      />
    </Container>
  );
}