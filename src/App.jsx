import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import { create } from "zustand";
import { useEffect, useState } from "react";
import "./App.css";

// ===== STORE =====
const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  posts: [],
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },
  setPosts: (posts) => set({ posts }),
  addPost: (post) =>
    set((s) => ({ posts: [post, ...s.posts] })),
}));

// ===== API =====
const fetchPosts = async () => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10"
  );
  if (!res.ok) throw new Error();
  return res.json();
};

// ===== UI =====
const Loader = () => <p>Загрузка...</p>;
const ErrorMsg = () => <p>Ошибка загрузки</p>;

// ===== NAVBAR =====
const Navbar = () => {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  return (
    <div className="nav">
      <Link to="/">Новости</Link>
      <Link to="/create">Создать</Link>

      {user ? (
        <>
          <Link to="/profile">Профиль</Link>
          <button onClick={() => setUser(null)}>Выйти</button>
        </>
      ) : (
        <Link to="/login">Войти</Link>
      )}
    </div>
  );
};

// ===== LAYOUT =====
const Layout = ({ children }) => {
  const user = useStore((s) => s.user);

  return (
    <>
      <Navbar />

      <div className="layout">
        <div className="sidebar">
          <Link to="/">Новости</Link>
          <Link to="/profile">Моя страница</Link>
          <Link to="/create">Создать пост</Link>
          {!user && <Link to="/login">Войти</Link>}
        </div>

        <div className="content">{children}</div>
      </div>
    </>
  );
};

// ===== FEED =====
const Feed = () => {
  const { posts, setPosts } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg />;

  return (
    <div>
      <h2>Новости</h2>

      {posts.map((p) => (
        <div className="post" key={p.id}>
          <Link to={`/post/${p.id}`}>
            <h4>{p.title}</h4>
          </Link>
          <p>{p.body}</p>
        </div>
      ))}
    </div>
  );
};

// ===== POST PAGE =====
const PostPage = () => {
  const { id } = useParams();
  const posts = useStore((s) => s.posts);

  const post = posts.find((p) => p.id == id);

  if (!post) return <Loader />;

  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </div>
  );
};

// ===== PROFILE =====
const Profile = () => {
  const user = useStore((s) => s.user);
  const posts = useStore((s) => s.posts);

  if (!user) return <p>Сначала войдите</p>;

  const myPosts = posts.filter((p) => p.userId === user.id);

  return (
    <div>
      <div className="profile">
        <div className="avatar"></div>
        <div>
          <h2>{user.name}</h2>
          <p>ID: {user.id}</p>
        </div>
      </div>

      <h3>Мои записи</h3>

      {myPosts.length === 0 && <p>Нет постов</p>}

      {myPosts.map((p) => (
        <div className="post" key={p.id}>
          <h4>{p.title}</h4>
          <p>{p.body}</p>
        </div>
      ))}
    </div>
  );
};

// ===== CREATE =====
const CreatePost = () => {
  const addPost = useStore((s) => s.addPost);
  const user = useStore((s) => s.user);
  const navigate = useNavigate();
  const [text, setText] = useState("");

  const submit = () => {
    if (!text) return;

    addPost({
      id: Date.now(),
      title: "Новый пост",
      body: text,
      userId: user?.id || 1,
    });

    navigate("/");
  };

  return (
    <div>
      <h2>Создать пост</h2>
      <textarea onChange={(e) => setText(e.target.value)} />
      <button onClick={submit}>Опубликовать</button>
    </div>
  );
};

// ===== LOGIN =====
const Login = () => {
  const setUser = useStore((s) => s.setUser);
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const login = () => {
    if (!name) return;
    setUser({ id: Date.now(), name });
    navigate("/");
  };

  return (
    <div className="login">
      <h2>Вход</h2>
      <input
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={login}>Войти</button>
    </div>
  );
};

// ===== APP =====
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}