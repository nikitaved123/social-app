import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";

const useSocket = () => {
  const setLikes = useStore((s) => s.setLikes);
  const setComments = useStore((s) => s.setComments);
  const wsRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const ws = new WebSocket(`ws://localhost:3001?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => console.log("✅ WS connected");

      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          console.log("📩 WS message:", data);

          if (data.type === "LIKE_UPDATE") {
            setLikes(data.postId, data.likes);
          }

          if (data.type === "COMMENT_UPDATE") {
            setComments(data.postId, data.comments);
          }
        } catch (err) {
          console.error("Ошибка парсинга WS сообщения:", err);
        }
      };

      ws.onerror = (error) => {
        console.error("❌ WS error:", error);
      };

      ws.onclose = () => {
        console.log("🔌 WS disconnected");
      };

      return () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
      };
    } catch (err) {
      console.error("Ошибка подключения WS:", err);
    }
  }, [setLikes, setComments]);

  return wsRef.current;
};

export default useSocket;