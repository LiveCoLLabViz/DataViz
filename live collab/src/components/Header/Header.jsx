import React, { useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Avatar from '../Common/Avatar';
import useAuth from '../../hooks/useAuth';
import useOutsideClick from '../../hooks/useOutsideClick';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
 

  useOutsideClick(dropdownRef, () => setDropdownOpen(false));
  //the above function will run when the user clicks outside the dropdown menu, and it will set the dropdownOpen state to false, effectively closing the dropdown menu.

  return (
    <header className="app-header">
      <nav className="app-header__nav">
        <a href="/livecollab-site/index.html" className="app-header__link">Home</a>
        <a href="/livecollab-site/about.html" className="app-header__link">About</a>
        <a href="/livecollab-site/contact.html" className="app-header__link">Contact Us</a>
      </nav>

      <div className="app-header__user" ref={dropdownRef}>
        <button
          type="button"
          className="app-header__user-btn"
          onClick={() => setDropdownOpen((o) => !o)}
        >
          <Avatar name={user?.name || 'Admin'} src={user?.avatarUrl} size={32} />
          <span className="app-header__username">{user?.name || 'Admin'}</span>
          <FiChevronDown className={`app-header__chevron ${dropdownOpen ? 'is-open' : ''}`} />
        </button>

        {dropdownOpen && (
          <ul className="app-header__dropdown" role="menu">
            <li>
              <button type="button" role="menuitem">Profile</button>
            </li>
            <li>
              <button type="button" role="menuitem" onClick={logout}>Logout</button>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
