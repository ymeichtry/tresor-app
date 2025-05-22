import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

/**
 * Layout
 * @author Peter Rutschmann
 */
const Layout = ({loginValues}) => {
    const [activeMenu, setActiveMenu] = useState(null);

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <div className="layout-container">
            <nav className="modern-nav">
                <div className="nav-header">
                    <h1 className="nav-title">Secret Tresor</h1>
                    <div className="user-status">
                        {loginValues.email === '' ? 
                            <span className="status-badge">Not logged in</span> : 
                            <span className="status-badge logged-in">Logged in as: {loginValues.email}</span>
                        }
                    </div>
                </div>
                
                <div className="nav-menu">
                    <div className="nav-section">
                        <button 
                            className={`nav-button ${activeMenu === 'secrets' ? 'active' : ''}`}
                            onClick={() => toggleMenu('secrets')}
                        >
                            Secrets
                        </button>
                        <div className={`submenu ${activeMenu === 'secrets' ? 'show' : ''}`}>
                            <Link to="/secret/secrets" className="nav-link">My Secrets</Link>
                            <Link to="/secret/newcredential" className="nav-link">New Credential</Link>
                            <Link to="/secret/newcreditcard" className="nav-link">New Credit Card</Link>
                            <Link to="/secret/newnote" className="nav-link">New Note</Link>
                        </div>
                    </div>

                    <div className="nav-section">
                        <button 
                            className={`nav-button ${activeMenu === 'user' ? 'active' : ''}`}
                            onClick={() => toggleMenu('user')}
                        >
                            User
                        </button>
                        <div className={`submenu ${activeMenu === 'user' ? 'show' : ''}`}>
                            <Link to="/user/login" className="nav-link">Login</Link>
                            <Link to="/user/register" className="nav-link">Register</Link>
                        </div>
                    </div>

                    <div className="nav-section">
                        <button 
                            className={`nav-button ${activeMenu === 'admin' ? 'active' : ''}`}
                            onClick={() => toggleMenu('admin')}
                        >
                            Admin
                        </button>
                        <div className={`submenu ${activeMenu === 'admin' ? 'show' : ''}`}>
                            <Link to="/user/users" className="nav-link">All Users</Link>
                            <li>Add user</li>
                            <Link to="/user/users/:id" className="nav-link">Edit User</Link>
                            <li>All secrets</li>
                        </div>
                    </div>

                    <Link to="/" className="nav-link about-link">About</Link>
                </div>
            </nav>

            <main className="main-content fade-in">
                <Outlet/>
            </main>
        </div>
    );
};

export default Layout;