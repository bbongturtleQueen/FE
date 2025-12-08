import { io } from "socket.io-client";

// Ubuntu 서버 IP
const socket = io("http://10.150.1.242:5000");

let currentCallback = null;

// 버튼 입력 리스닝 시작
export function listenButton(callback) {
  currentCallback = callback;

  socket.on("button_pressed", (data) => {
    if (currentCallback) {
      currentCallback(data.choice);
    }
  });
}

// 버튼 입력 리스닝 중지
export function stopButton() {
  socket.off("button_pressed");
  currentCallback = null;
}