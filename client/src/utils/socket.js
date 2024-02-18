import io from "socket.io-client";

const socket = new WebSocket("ws://localhost:8000/ws/chat/"); // Replace with your WebSocket URL // Replace with your server URL

export default socket;
