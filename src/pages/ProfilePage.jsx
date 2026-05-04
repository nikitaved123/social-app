import { useStore } from "../store/useStore";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const user = useStore((s) => s.user);
  const posts = useStore((s) => s.posts);

  if (!user) {
    return (
      <div className="center">
        <p>Сначала войдите в систему</p>
        <Link to="/login">
          <button className="btn primary">Войти</button>
        </Link>
      </div>
    );
  }

  const myPosts = posts.filter((p) => p.userId === user.id);

  return (
    <div>
      <div className="card profile-card">
        <div className="avatar" style={{ 
          width: '100px', 
          height: '100px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px'
        }}>
          👤
        </div>

        <div>
          <h2>{user.name}</h2>
          <p>ID: {user.id}</p>
          <p>Email: {user.email || "не указан"}</p>
        </div>
      </div>

      <h3 className="section-title">Мои посты ({myPosts.length})</h3>

      {myPosts.length === 0 && (
        <div className="card">
          <p>У вас пока нет постов</p>
          <Link to="/create">
            <button className="btn primary">Создать первый пост</button>
          </Link>
        </div>
      )}

      {myPosts.map((p) => (
        <div key={p.id} className="post">
          <h4>{p.title}</h4>
          {p.body && <p>{p.body}</p>}
          <small style={{ opacity: 0.6 }}>
            {p.createdAt ? new Date(p.createdAt).toLocaleString() : "Только что"}
          </small>
        </div>
      ))}
    </div>
  );
};

export default ProfilePage;