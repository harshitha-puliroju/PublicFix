import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import '../styles/workspace.css';

const AuthenticatedLayout = ({ user, profile, role }) => {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('publicfix-sidebar-collapsed') === 'true');
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const [theme, setTheme] = useState(() => localStorage.getItem('publicfix-theme') === 'dark' ? 'dark' : 'light');
  const [logoutError, setLogoutError] = useState('');
  const navigate = useNavigate();
  const displayName = profile?.displayName || user.displayName || (role === 'Official' ? 'Official' : 'Citizen');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const updateViewport = (event) => {
      setIsMobile(event.matches);
      setMobileNavigationOpen(false);
    };
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    localStorage.setItem('publicfix-sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem('publicfix-theme', theme);
  }, [theme]);

  const closeMobileNavigation = () => setMobileNavigationOpen(false);
  const toggleSidebar = () => {
    if (isMobile) setMobileNavigationOpen((open) => !open);
    else setCollapsed((isCollapsed) => !isCollapsed);
  };
  const toggleTheme = () => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');

  const handleLogout = async () => {
    setLogoutError('');
    try {
      await signOut(auth);
      closeMobileNavigation();
      navigate('/login', { replace: true });
    } catch (error) {
      setLogoutError('Unable to log out. Please try again.');
      if (process.env.NODE_ENV === 'development') {
        console.error('Sign out failed:', { code: error.code, message: error.message });
      }
    }
  };

  return (
    <div className={`authenticated-layout${collapsed ? ' app-sidebar-collapsed' : ''}${mobileNavigationOpen ? ' app-sidebar-open' : ''}`} data-theme={theme}>
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <button
            className="sidebar-brand"
            type="button"
            aria-label={isMobile ? (mobileNavigationOpen ? 'Close navigation menu' : 'Open navigation menu') : (collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
            aria-expanded={isMobile ? mobileNavigationOpen : !collapsed}
            aria-controls="authenticated-navigation"
            data-tooltip={isMobile ? 'Toggle navigation' : (collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
            onClick={toggleSidebar}
          >
            <span className="sidebar-brand-mark" aria-hidden="true">P</span>
            <span className="sidebar-brand-name">PublicFix</span>
          </button>
        </div>

        <nav id="authenticated-navigation" className="sidebar-navigation" aria-label="Main navigation">
          <NavLink className="sidebar-link" to="/publicfix" end aria-label="Dashboard / Map" data-tooltip="Dashboard / Map" onClick={closeMobileNavigation}>
            <span className="sidebar-link-icon" aria-hidden="true">⌖</span>
            <span className="sidebar-link-label">Dashboard / Map</span>
          </NavLink>
          <NavLink className="sidebar-link" to="/publicfix#report-issue" aria-label="Report Issue" data-tooltip="Report Issue" onClick={closeMobileNavigation}>
            <span className="sidebar-link-icon" aria-hidden="true">＋</span>
            <span className="sidebar-link-label">Report Issue</span>
          </NavLink>
          <NavLink className="sidebar-link" to="/my-reports" aria-label="My Reports" data-tooltip="My Reports" onClick={closeMobileNavigation}>
            <span className="sidebar-link-icon" aria-hidden="true">▤</span>
            <span className="sidebar-link-label">My Reports</span>
          </NavLink>
          <NavLink className="sidebar-link" to="/profile" aria-label="My Profile" data-tooltip="My Profile" onClick={closeMobileNavigation}>
            <span className="sidebar-link-icon" aria-hidden="true">○</span>
            <span className="sidebar-link-label">My Profile</span>
          </NavLink>
          <NavLink className="sidebar-link" to="/settings" aria-label="Settings" data-tooltip="Settings" onClick={closeMobileNavigation}>
            <span className="sidebar-link-icon" aria-hidden="true">⚙</span>
            <span className="sidebar-link-label">Settings</span>
          </NavLink>
          {role === 'Official' && (
            <NavLink className="sidebar-link" to="/admindashboard" aria-label="Official Dashboard" data-tooltip="Official Dashboard" onClick={closeMobileNavigation}>
              <span className="sidebar-link-icon" aria-hidden="true">▦</span>
              <span className="sidebar-link-label">Official Dashboard</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-account">
          <div className="sidebar-user" role="group" aria-label={`${displayName}, ${role}`} data-tooltip={`${displayName} · ${role}`}>
            <span className="sidebar-user-avatar" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</span>
            <span className="sidebar-user-copy">
              <strong>{displayName}</strong>
              <span>{role}</span>
            </span>
          </div>
          {logoutError && <p className="sidebar-error" role="alert">{logoutError}</p>}
          <button
            className="sidebar-theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-pressed={theme === 'dark'}
            data-tooltip={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
          >
            <span className="sidebar-action-icon" aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            <span className="sidebar-action-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <button className="sidebar-logout" type="button" aria-label="Logout" data-tooltip="Logout" onClick={handleLogout}>
            <span className="sidebar-action-icon" aria-hidden="true">↪</span>
            <span className="sidebar-action-label">Logout</span>
          </button>
        </div>
      </aside>
      <main className="workspace-main">
        <Outlet context={{ theme, toggleTheme }} />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;
