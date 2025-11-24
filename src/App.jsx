import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './pages/start.jsx';

import StdMain from './pages/student/stdmain.jsx';

import TurtleEnterCode from './pages/student/turtle/entercode.jsx';
import TurtleNickname from './pages/student/turtle/nickname.jsx';
import TurtleWait from './pages/student/turtle/wait.jsx';
import TurtleReady from './pages/student/turtle/ready.jsx';
import TurtlePlay from './pages/student/turtle/play.jsx';
import GameOver from './pages/student/turtle/gameover.jsx';
import Rank from './pages/student/turtle/rank.jsx';

import MemoryReady from './pages/student/memory/ready.jsx';
import MemoryPlay from './pages/student/memory/play.jsx';

import MusicReady from './pages/student/music/ready.jsx';
import MusicPlay from './pages/student/music/play.jsx';

import MoleReady from './pages/student/mole/ready.jsx'
import MolePlay from './pages/student/mole/play.jsx';



import TchMain from './pages/teacher/tchmain.jsx';
import MakeProblem from './pages/teacher/makeproblem.jsx';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />

        <Route path="/std/main" element={<StdMain />} />

        <Route path="/std/turtle/entercode" element={<TurtleEnterCode />} />
        <Route path="/std/turtle/nickname" element={<TurtleNickname />} />
        <Route path="/std/turtle/wait" element={<TurtleWait />} />
        <Route path="/std/turtle/ready" element={<TurtleReady />} />
        <Route path="/std/turtle/play" element={<TurtlePlay />} />
        <Route path="/std/turtle/gameover" element={<GameOver />} />
        <Route path="/std/turtle/rank" element={<Rank />} />

        <Route path="/std/memory/ready" element={<MemoryReady />} />
        <Route path="/std/memory/play" element={<MemoryPlay />} />

        <Route path="/std/music/ready" element={<MusicReady />} />
        <Route path="/std/music/play" element={<MusicPlay />} />

        <Route path="/std/mole/ready" element={<MoleReady />} />
        <Route path="/std/mole/play" element={<MolePlay />} />


        <Route path="/tch/main" element={<TchMain/>} />
        <Route path="/tch/makeproblem" element={<MakeProblem />} />
      </Routes>
    </BrowserRouter>
  );
}