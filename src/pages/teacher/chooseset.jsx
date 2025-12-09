import React, { useState, useEffect } from 'react';
import styled from 'styled-components'; // useNavigate는 더 이상 사용하지 않아도 되지만, 혹시 모를 경우를 대비해 남겨둡니다.
import TurtleIcon from '../../assets/turtle.png';

const Container = styled.div`
  width: 1040px;
  height: 630px;
  display: flex;
  flex-direction: column;
  padding: 50px 70px 50px 70px;
  background-color: #E3FFE9;
  position: relative;
  overflow: hidden;
`;

const Title = styled.p`
  font-size: 28px;
  font-weight: bold;
  color:rgb(0, 0, 0);
  margin-bottom: 40px;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 486px 486px;
  gap: 60px;
  width: 100%;
`;

// 클릭 기능이 없어지므로 hover 효과와 cursor: pointer를 제거합니다.
const GameCard = styled.div` 
  display: flex;
  width: 100%;
  height: 187px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background-color:rgb(236, 255, 239);
  border: 2px solid #B4B4B4;
  border-radius: 20px;
  transition: all 0.3s ease;
`;

const GameIcon = styled.div`
  width: 143px;
  height: 137px;
  margin-right: 40px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const GameInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const GameTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #1d1d1d;
  margin-top: 40px;
  margin-bottom: 4px;
`;

// 초대 코드를 강조하기 위한 스타일 추가
const InviteCode = styled.p`
  font-size: 40px;
  font-weight: bold;
  color: #56CF6E;
  margin-top: 5px;
  line-height: 1.2;
`;


// 6자리 랜덤 초대 코드를 생성하는 함수
const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// **더미 데이터**
const DUMMY_SETS = [
    { id: 1, name: "부유초 2학년 1반", inviteCode: null, description: "즐거운 덧셈 뺄셈 세트" },
    { id: 2, name: "평화초 5학년 과학", inviteCode: "123456", description: "광합성과 호흡 문제" },
    { id: 3, name: "행복초 3학년 사회", inviteCode: null, description: "우리 동네 지도 그리기" },
];


export default function ChooseSet() {
    // navigate는 더 이상 사용되지 않지만, import는 그대로 둡니다.
    // const navigate = useNavigate();
    const [sets, setSets] = useState([]); // 초기값은 빈 배열로 두고 useEffect에서 채웁니다.
    const [loading, setLoading] = useState(true);

    // 더미 세트 제목 ( makeproblem.jsx에서 넘어왔다고 가정)
    const [lastCreatedSetName] = useState('더미 세트 제목');

    // 1. 세트 목록 로드 후 초대 코드 생성 및 업데이트
    useEffect(() => {
        // API 호출을 대체하는 더미 데이터 로딩 (비동기 효과를 위해 setTimeout 사용)
        const fetchAndGenerateCodes = () => {
            setLoading(true);
            setTimeout(() => {
                const initialSets = DUMMY_SETS;

                // 1. 코드가 없는 세트를 찾아서 코드를 생성합니다.
                const updatedSets = initialSets.map(set => {
                    if (!set.inviteCode) {
                        const newCode = generateRandomCode();
                        // **실제 배포 시: 여기서 새로 생성된 코드를 서버에 저장해야 합니다!**
                        console.log(`[더미] 세트 ID ${set.id}에 새로운 코드 생성: ${newCode}`);
                        return { ...set, inviteCode: newCode };
                    }
                    return set;
                });

                // 2. 업데이트된 세트 목록을 상태에 저장합니다.
                setSets(updatedSets);
                setLoading(false);

            }, 500); // 로딩 효과를 위해 0.5초 딜레이
        };

        fetchAndGenerateCodes();

    }, []); // 컴포넌트 마운트 시 한 번만 실행

    // 클릭 이벤트 핸들러는 제거합니다.

    return (
        <Container>
            {/* lastCreatedSetName 상태를 사용하여 제목 표시 */}
            <Title>
                {lastCreatedSetName
                    ? `방금 만든 '${lastCreatedSetName}' 세트를 공유해요!`
                    : `세트를 하나 공유해요!!`}
            </Title>

            <GameGrid>
                {loading ? (
                    <p style={{ gridColumn: '1 / span 2', textAlign: 'center', color: '#888' }}>
                        세트 목록 불러오는 중...
                    </p>
                ) : sets.length > 0 ? (
                    sets.map((set) => (
                        // 클릭 이벤트 제거
                        <GameCard key={set.id}>
                            <GameIcon>
                                <img src={TurtleIcon} alt={set.name} />
                            </GameIcon>
                            <GameInfo>
                                <GameTitle>{set.name}</GameTitle>
                                <p style={{ fontSize: '16px', color: '#858585', margin: '0' }}>
                                    초대 코드를 학생들에게 안내하세요!
                                </p>
                                {/* 코드가 무조건 존재하므로 바로 표시 */}
                                {set.inviteCode && (
                                    <InviteCode>{set.inviteCode}</InviteCode>
                                )}
                            </GameInfo>
                        </GameCard>
                    ))
                ) : (
                    <p style={{ gridColumn: '1 / span 2', textAlign: 'center', color: '#888' }}>
                        아직 만든 문제 세트가 없습니다. 문제를 만들어주세요!
                    </p>
                )}
            </GameGrid>
        </Container>
    );
}