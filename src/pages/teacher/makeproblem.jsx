import React, { useState } from 'react';
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

// 📌 임시 API (localStorage로 저장)
//    => 나중에 백엔드에서 API 받으면 여기만 fetch로 교체
async function saveProblemSetAPI(problemSet) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = JSON.parse(localStorage.getItem("problemSets") || "[]");
      const newSet = {
        id: Date.now(), // 임시 ID
        ...problemSet,
      };
      saved.push(newSet);
      localStorage.setItem("problemSets", JSON.stringify(saved));
      resolve(newSet);
    }, 300); // 지연 효과
  });
}

export default function MakeProblem() {
  const [loading, setLoading] = useState(false);

  const handleModalSubmit = async (data) => {
    setLoading(true);

    try {
      // ✔ 문제 세트 저장 요청
      const result = await saveProblemSetAPI(data);
      console.log("저장된 문제 세트:", result);

      alert("문제 세트가 저장되었습니다!");

      // ✔ 저장 후 선택 화면으로 이동
      window.location.href = "/teacher/chooseset";

    } catch (err) {
      console.error(err);
      alert("문제 세트 저장 중 오류 발생");
    }

    setLoading(false);
  };

  const handleClose = () => {
    window.history.back();
  };

  return (
    <Container>
      {loading && <div style={{ fontSize: "20px" }}>저장 중...</div>}

      <ProblemModal
        onClose={handleClose}
        onSubmit={handleModalSubmit}
      />
    </Container>
  );
}
