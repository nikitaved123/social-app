import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useState, useEffect } from "react";

const PostCard = ({ post }) => {
  const { user, likes, setLikes, comments } = useStore();
  const [userLikes, setUserLikes] = useState({});
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const savedLikes = localStorage.getItem(`user_likes_${user?.id}`);
    if (savedLikes) {
      setUserLikes(JSON.parse(savedLikes));
    }
  }, [user]);

  const handleLike = () => {
    if (!user) {
      alert("Войдите в аккаунт, чтобы поставить лайк");
      return;
    }

    const isLiked = userLikes[post.id];
    const currentLikes = likes[post.id] || 0;

    if (isLiked) {
      setLikes(post.id, currentLikes - 1);
      const newUserLikes = { ...userLikes };
      delete newUserLikes[post.id];
      setUserLikes(newUserLikes);
      localStorage.setItem(`user_likes_${user.id}`, JSON.stringify(newUserLikes));
    } else {
      setLikes(post.id, currentLikes + 1);
      const newUserLikes = { ...userLikes, [post.id]: true };
      setUserLikes(newUserLikes);
      localStorage.setItem(`user_likes_${user.id}`, JSON.stringify(newUserLikes));
    }
  };

  const handleComment = (e) => {
    if (e.key === "Enter" && commentText.trim()) {
      const newComment = {
        id: Date.now(),
        text: commentText,
        userName: user?.name || "Аноним",
        userId: user?.id,
        createdAt: new Date().toISOString()
      };
      
      const currentComments = comments[post.id] || [];
      setComments(post.id, [...currentComments, newComment]);
      setCommentText("");
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            {post.userId === user?.id ? user?.name?.[0] || "U" : `U${post.userId}`}
          </div>
          <div>
            <div className="author-name">
              {post.userId === user?.id ? user?.name || "Вы" : `Пользователь ${post.userId}`}
            </div>
            <div className="post-date">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Сегодня"}
            </div>
          </div>
        </div>
      </div>

      <Link to={`/post/${post.id}`} className="post-link">
        <h3 className="post-title">{post.title}</h3>
        {post.body && (
          <p className="post-body-preview">
            {post.body.substring(0, 150)}{post.body.length > 150 ? "..." : ""}
          </p>
        )}
      </Link>

      <div className="post-stats">
        <span>❤️ {likes[post.id] || 0} лайков</span>
        <span>💬 {(comments[post.id] || []).length} комментариев</span>
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn like-btn ${userLikes[post.id] ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {userLikes[post.id] ? '❤️' : '🤍'} {likes[post.id] || 0}
        </button>

        <Link to={`/post/${post.id}`} className="action-btn">
          🔍 Подробнее
        </Link>
      </div>

      <div className="comment-input-wrapper">
        <input
          className="comment-input"
          type="text"
          placeholder="Написать комментарий..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleComment}
        />
      </div>

      {(comments[post.id] || []).slice(0, 2).map((c, idx) => (
        <div className="comment-preview" key={c.id || idx}>
          <b>{c.userName || "Аноним"}:</b> {c.text.substring(0, 100)}{c.text.length > 100 ? "..." : ""}
        </div>
      ))}
      
      {(comments[post.id] || []).length > 2 && (
        <Link to={`/post/${post.id}`} className="show-more-comments">
          Показать еще {(comments[post.id] || []).length - 2} комментария...
        </Link>
      )}
    </div>
  );
};

export default PostCard;