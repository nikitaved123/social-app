import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, user, likes, setLikes, comments, setComments } = useStore();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const foundPost = posts.find(p => p.id === parseInt(id));
    if (foundPost) {
      setPost(foundPost);
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [id, posts]);

  useEffect(() => {
    const savedLikes = localStorage.getItem(`user_likes_${user?.id}`);
    if (savedLikes) {
      const userLikes = JSON.parse(savedLikes);
      setIsLiked(userLikes[id] || false);
    }
  }, [user, id]);

  const handleLike = () => {
    if (!user) {
      alert("Войдите чтобы поставить лайк");
      return;
    }

    const currentLikes = likes[post.id] || 0;

    if (isLiked) {
      setLikes(post.id, currentLikes - 1);
      setIsLiked(false);
      const savedLikes = localStorage.getItem(`user_likes_${user.id}`);
      if (savedLikes) {
        const userLikes = JSON.parse(savedLikes);
        delete userLikes[post.id];
        localStorage.setItem(`user_likes_${user.id}`, JSON.stringify(userLikes));
      }
    } else {
      setLikes(post.id, currentLikes + 1);
      setIsLiked(true);
      const savedLikes = localStorage.getItem(`user_likes_${user.id}`);
      const userLikes = savedLikes ? JSON.parse(savedLikes) : {};
      userLikes[post.id] = true;
      localStorage.setItem(`user_likes_${user.id}`, JSON.stringify(userLikes));
    }
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    if (!user) {
      alert("Войдите чтобы оставить комментарий");
      return;
    }

    const newComment = {
      id: Date.now(),
      text: commentText,
      userName: user.name,
      userId: user.id,
      createdAt: new Date().toISOString()
    };

    const currentComments = comments[post.id] || [];
    setComments(post.id, [...currentComments, newComment]);
    setCommentText("");
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMsg />;

  return (
    <div className="post-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>
      
      <div className="post-full">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>Автор: {post.userId === user?.id ? user.name : `Пользователь ${post.userId}`}</span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
        <p className="post-body">{post.body}</p>

        <div className="post-actions">
          <button 
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '❤️' : '🤍'} {likes[post.id] || 0}
          </button>
        </div>

        <div className="comments-section">
          <h3>Комментарии ({comments[post.id]?.length || 0})</h3>
          
          {user && (
            <div className="add-comment">
              <textarea
                placeholder="Написать комментарий..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
              />
              <button className="btn primary" onClick={handleComment}>
                Отправить
              </button>
            </div>
          )}

          {!user && (
            <div className="login-to-comment">
              <p>Войдите, чтобы оставить комментарий</p>
              <Link to="/login" className="btn primary">Войти</Link>
            </div>
          )}

          <div className="comments-list">
            {(comments[post.id] || []).map((c, idx) => (
              <div className="comment-card" key={idx}>
                <div className="comment-header">
                  <b>{c.userName}</b>
                  <small>{new Date(c.createdAt).toLocaleString()}</small>
                </div>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;