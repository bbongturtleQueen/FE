import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// std + tch
import Start from './pages/start.jsx';

// std
import StdMain from './pages/student/stdmain.jsx';
// turtle game
import TurtleEnterCode from './pages/student/turtle/entercode.jsx';
import TurtleNickname from './pages/student/turtle/nickname.jsx';
import TurtleWait from './pages/student/turtle/wait.jsx';
import TurtleReady from './pages/student/turtle/ready.jsx';
import TurtlePlay from './pages/student/turtle/play.jsx';
import GameOver from './pages/student/turtle/gameover.jsx';
import Rank from './pages/student/turtle/rank.jsx';
// memory game
import MemoryReady from './pages/student/memory/ready.jsx';
import MemoryPlay from './pages/student/memory/play.jsx';
// music game
import MusicReady from './pages/student/music/ready.jsx';
import MusicPlay from './pages/student/music/play.jsx';
// mole game
import MoleReady from './pages/student/mole/ready.jsx'
import MolePlay from './pages/student/mole/play.jsx';
/* ----------- */

// tch
import Welcome from './pages/teacher/welcome.jsx';
import Login from './pages/teacher/login.jsx';
import Signup from './pages/teacher/signup.jsx';
import Ready from './pages/teacher/ready.jsx';
import MakeProblem from './pages/teacher/makeproblem.jsx';
import ChooseSet from './pages/teacher/chooseset.jsx';
import EnterCode from './pages/teacher/entercode.jsx';


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


        <Route path="/tch/welcome" element={<Welcome/>} />
        <Route path="/tch/login" element={<Login/>} />
        <Route path="/tch/signup" element={<Signup />} />
        <Route path="/tch/ready" element={<Ready/>}/>
        <Route path="/tch/makeproblem" element={<MakeProblem />} />
        <Route path="/tch/chooseset" element={<ChooseSet/>} />
        <Route path="/tch/entercode" element={<EnterCode/>} />
      </Routes>
    </BrowserRouter>
  );
}