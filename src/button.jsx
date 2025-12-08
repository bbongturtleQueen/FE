// =======button.jsx에 적을 코드========
// src/utils/button.jsx
import { io } from "socket.io-client";

// 라즈베리파이 서버 연결
const socket = io("http://10.150.1.242:5000", {
    transports: ["websocket"],   // 안정성 ↑
});

console.log("📡 Raspberry Pi socket initialized");

// 버튼 신호를 듣는 함수
export function listenButton(callback) {
    // 버튼 신호 받기
    socket.on("button_to_front", (data) => {
        console.log("버튼 수신:", data);

        // choice 번호만 넘겨줌 (0~4 범위)
        if (callback) callback(data.choice);
    });
}

// 버튼 리스너 제거
export function stopButton() {
    socket.off("button_to_front");
}