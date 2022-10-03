import React from 'react';
import navStyles from './Nav.module.css';

export default function Nav(props) {
  const { theme, toggleTheme } = props;
  return (
    <div className={navStyles.nav}>
      <div className={navStyles.logo}>
        <h1>ATELIER</h1>
        <button type="submit" className={navStyles.themeToggle} onClick={toggleTheme}>
          {theme ? '🌞' : '🌛'}
        </button>
      </div>
      <input className={navStyles.formInput} type="text" />
      <div className={navStyles.formButton}>🔍</div>
    </div>
  );
}
