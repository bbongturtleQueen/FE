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

export default function MusicPlay() {
  return (
    <Container>
      <Title>핑핑! 뾰로롱 게임 시작!</Title>
    </Container>
  );
}