import React from 'react';
import styled from 'styled-components';
import ReadyModal from '../../../components/readymodal.jsx';

const Container = styled.div`
  width: 1180px;
  height: 730px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #E3FFE9;
`;

export default function MemoryReady() {
  return (
    <Container>
      <ReadyModal color="#F7BD00" gameRoute="/std/memory/play" />
    </Container>
  );
}