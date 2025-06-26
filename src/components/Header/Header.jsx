import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/logo.png';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Filmer" />
        </Link>
        <nav className={styles.nav}>
          <Link to="/login">로그인</Link>
        </nav>
      </div>
    </header>
  );
}
