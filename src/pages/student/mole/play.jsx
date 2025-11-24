import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E3FFE9;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #22C55E;
`;

export default function MolePlay() {
  return (
    <Container>
      <Title>두.. 때리기 게임</Title>
    </Container>
  );
}