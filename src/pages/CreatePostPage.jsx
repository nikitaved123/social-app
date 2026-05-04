import { useState } from "react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

const CreatePostPage = () => {
  const addPost = useStore((s) => s.addPost);
  const user = useStore((s) => s.user);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    if (!title.trim()) {
      alert("Введите заголовок поста");
      return;
    }

    if (!body.trim()) {
      alert("Введите текст поста");
      return;
    }
    
    setIsSubmitting(true);
    
    const newPost = {
      id: Date.now(),
      title: title,
      body: body,
      userId: user?.id || 1,
      createdAt: new Date().toISOString()
    };
    
    addPost(newPost);
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/");
    }, 300);
  };

  return (
    <div className="card">
      <h2>Создать пост</h2>
      
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Вы вошли как: {user?.name || "Гость"}
      </p>

      <input
        type="text"
        className="input"
        placeholder="Заголовок поста"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
      />

      <textarea
        className="textarea"
        placeholder="Текст поста"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        disabled={isSubmitting}
      />

      <button 
        className="btn btn-primary" 
        onClick={submit}
        disabled={isSubmitting || !title.trim() || !body.trim()}
        style={{ marginTop: '10px' }}
      >
        {isSubmitting ? "Публикация..." : "Опубликовать"}
      </button>
    </div>
  );
};

export default CreatePostPage;