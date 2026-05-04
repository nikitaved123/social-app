import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { fetchPosts } from "../components/api";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

const Feed = () => {
  const { posts, setPosts, likes, setLikes, comments, setComments, user } = useStore();
  const [loading, setLoading] = useState(posts.length === 0);
  const [error, setError] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [userLikes, setUserLikes] = useState({});

  useEffect(() => {
    const savedLikes = localStorage.getItem(`user_likes_${user?.id}`);
    if (savedLikes) {
      setUserLikes(JSON.parse(savedLikes));
    }
  }, [user]);

  useEffect(() => {
    if (posts.length === 0) {
      setLoading(true);
      fetchPosts()
        .then((fetchedPosts) => {
          setPosts(fetchedPosts);
          const initialLikes = {};
          fetchedPosts.forEach(post => {
            initialLikes[post.id] = Math.floor(Math.random() * 50) + 10;
          });
          Object.keys(initialLikes).forEach(postId => {
            if (!likes[postId]) {
              setLikes(parseInt(postId), initialLikes[postId]);
            }
          });
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [posts.length, setPosts, setLikes, likes]);

  const handleLike = (postId) => {
    if (!user) {
      alert("Войдите в аккаунт, чтобы поставить лайк");
      return;
    }

    const isLiked = userLikes[postId];
    const currentLikes = likes[postId] || 0;

    if (isLiked) {
      setLikes(postId, currentLikes - 1);
      const newUserLikes = { ...userLikes };
      delete newUserLikes[postId];
      setUserLikes(newUserLikes);
      localStorage.setItem(`user_likes_${user.id}`, JSON.stringify(newUserLikes));
    } else {
      setLikes(postId, currentLikes + 1);
      const newUserLikes = { ...userLikes, [postId]: true };
      setUserLikes(newUserLikes);
      localStorage.setItem(`user_likes_${user.id}`, JSON.stringify(newUserLikes));
    }
  };

  const handleComment = (postId, text) => {
    if (!text.trim()) return;
    
    if (!user) {
      alert("Войдите в аккаунт, чтобы оставить комментарий");
      return;
    }
    
    const newComment = {
      id: Date.now(),
      text: text,
      userName: user?.name || "Аноним",
      userId: user?.id,
      createdAt: new Date().toISOString()
    };
    
    const currentComments = comments[postId] || [];
    setComments(postId, [...currentComments, newComment]);
    setCommentTexts(prev => ({ ...prev, [postId]: "" }));
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMsg />;

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>Лента новостей</h2>
        {user && (
          <Link to="/create" className="create-post-btn">
            ✏️ Создать пост
          </Link>
        )}
      </div>

      {posts.length === 0 && (
        <div className="empty-feed">
          <p>Нет постов</p>
          {user && (
            <Link to="/create" className="btn primary">
              Создать первый пост
            </Link>
          )}
        </div>
      )}

      {posts.map((p) => (
        <div className="post-card" key={p.id}>
          <div className="post-header">
            <div className="post-author">
              <div className="author-avatar">
                {p.userId === user?.id ? user?.name?.[0] || "U" : `U${p.userId}`}
              </div>
              <div>
                <div className="author-name">
                  {p.userId === user?.id ? user?.name || "Вы" : `Пользователь ${p.userId}`}
                </div>
                <div className="post-date">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Сегодня"}
                </div>
              </div>
            </div>
          </div>

          <Link to={`/post/${p.id}`} className="post-link">
            <h3 className="post-title">{p.title}</h3>
            {p.body && <p className="post-body-preview">{p.body.substring(0, 150)}{p.body.length > 150 ? "..." : ""}</p>}
            {!p.body && <p className="post-body-preview">{p.title}</p>}
          </Link>

          <div className="post-stats">
            <span>❤️ {likes[p.id] || 0} лайков</span>
            <span>💬 {(comments[p.id] || []).length} комментариев</span>
          </div>

          <div className="post-actions">
            <button 
              className={`action-btn like-btn ${userLikes[p.id] ? 'liked' : ''}`}
              onClick={() => handleLike(p.id)}
            >
              {userLikes[p.id] ? '❤️' : '🤍'} {likes[p.id] || 0}
            </button>

            <button 
              className="action-btn comment-btn"
              onClick={() => {
                const input = document.getElementById(`comment-input-${p.id}`);
                if (input) input.focus();
              }}
            >
              💬 Комментировать
            </button>

            <Link to={`/post/${p.id}`} className="action-btn">
              🔍 Подробнее
            </Link>
          </div>

          <div className="comment-input-wrapper">
            <input
              id={`comment-input-${p.id}`}
              className="comment-input"
              type="text"
              placeholder="Написать комментарий..."
              value={commentTexts[p.id] || ""}
              onChange={(e) => setCommentTexts(prev => ({
                ...prev,
                [p.id]: e.target.value
              }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleComment(p.id, commentTexts[p.id] || "");
                }
              }}
            />
          </div>

          {(comments[p.id] || []).slice(0, 2).map((c, idx) => (
            <div className="comment-preview" key={idx}>
              <b>{c.userName || "Аноним"}:</b> {c.text.substring(0, 100)}{c.text.length > 100 ? "..." : ""}
            </div>
          ))}
          
          {(comments[p.id] || []).length > 2 && (
            <Link to={`/post/${p.id}`} className="show-more-comments">
              Показать еще {(comments[p.id] || []).length - 2} комментария...
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default Feed;