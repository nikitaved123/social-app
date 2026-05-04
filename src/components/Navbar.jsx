import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

const Navbar = () => {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        ⚡ SciApp
      </div>

      <div className="nav-center">
        <Link to="/">🏠 Лента</Link>
        <Link to="/create">✏️ Создать</Link>
        {user && <Link to="/profile">👤 Профиль</Link>}
      </div>

      <div className="nav-right">
        {user ? (
          <button className="btn danger" onClick={logout}>
            Выйти
          </button>
        ) : (
          <Link to="/login">
            <button className="btn primary">🔐 Войти</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;