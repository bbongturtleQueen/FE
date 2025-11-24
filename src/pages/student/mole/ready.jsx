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

export default function MoleReady() {
  return (
    <Container>
      <ReadyModal color="#A19081" gameRoute="/std/mole/play" />
    </Container>
  );
}