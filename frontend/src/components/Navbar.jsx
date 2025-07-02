import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);

        const updateUser = () => {
            const updatedUser = JSON.parse(localStorage.getItem("user"));
            setUser(updatedUser);
        };

        window.addEventListener("userLoggedIn", updateUser);
        return () => window.removeEventListener("userLoggedIn", updateUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    const getDashboardPath = (role) => {
        switch (role) {
            case "patient":
                return "/patient/dashboard";
            case "dietitian":
                return "/dietitian/dashboard";
            case "management":
                return "/management/dashboard";
            default:
                return "/";
        }
    };

    return (
        <nav className="custom-navbar">
            <header className="custom-header">
                <h2 className="header-title">
                    Hospital Food Management System
                </h2>
            </header>
            <div className="navbar-content">
                {user ? (
                    <>
                        {/* <Link to={getDashboardPath(user.role)} className="nav-link">🏠 Dashboard</Link> */}
                        <Link to="/patient/profile" className="nav-link">👤 {user.name}</Link>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        {/* Show login/register only when on pages that aren't login or register */}
                        {location.pathname !== "/" && (
                            <Link to="/" className="nav-link">Login</Link>
                        )}
                        {location.pathname !== "/register" && (
                            <Link to="/register" className="nav-link">Register</Link>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
