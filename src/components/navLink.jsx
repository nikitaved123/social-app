import { Link } from "react-router-dom";

const NavLink = ({ to, children }) => {
  const handleClick = (e) => {
    // Не показываем загрузку, просто переходим
    console.log("Навигация к:", to);
  };

  return (
    <Link to={to} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default NavLink;