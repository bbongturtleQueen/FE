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

export default function MusicReady() {
  return (
    <Container>
      <ReadyModal color="#FF4CEA" gameRoute="/std/music/play" />
    </Container>
  );
}