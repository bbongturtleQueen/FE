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

// ⭐ 세트 생성 API
async function createProblemSetAPI(setName, teacherId) {
    const response = await fetch("http://localhost:8000/api/create-set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: setName,
            teacher_id: teacherId,
        }),
    });

    const data = await response.json();
    return data;
}

// ⭐ 문제 추가 API
async function addQuestionAPI(setName, question) {
    const response = await fetch("http://localhost:8000/api/add-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            set_name: setName,
            question: question.question,
            answer: question.answer,
            choices: question.choices,
        }),
    });

    const data = await response.json();
    return data;
}

export default function MakeProblem() {
    const [loading, setLoading] = useState(false);

    const handleModalSubmit = async (data) => {
        // data = { setName: "...", problems: [ {question, answer, choices}, ... ] }

        setLoading(true);

        const teacherId = localStorage.getItem("teacherId") || "teacher01";

        try {
            // 1️⃣ 세트 생성 API 호출
            const result = await createProblemSetAPI(data.setName, teacherId);

            if (result.status === "error") {
                alert(`세트 생성 실패: ${result.message}`);
                setLoading(false);
                return;
            }

            console.log("세트 생성됨:", result);

            // 2️⃣ 문제들 하나씩 등록
            for (const p of data.problems) {
                const qResult = await addQuestionAPI(data.setName, p);

                if (qResult.status === "error") {
                    alert(`문제 저장 실패: ${qResult.message}`);
                    setLoading(false);
                    return;
                }
            }

            alert("문제 세트 저장 완료!");

            // 3️⃣ 완료 후 choose set 으로 이동
            window.location.href = "/teacher/chooseset";

        } catch (err) {
            console.error(err);
            alert("API 오류 발생 — 서버와 연결되지 않았습니다.");
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
