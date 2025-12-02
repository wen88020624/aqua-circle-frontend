import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/aquariums', label: '魚缸管理' },
    { path: '/organisms', label: '生物管理' },
    { path: '/feedings', label: '餵食記錄' },
    { path: '/water-changes', label: '換水記錄' },
    { path: '/medications', label: '下藥記錄' },
    { path: '/water-quality', label: '水質檢測' },
    { path: '/consumables', label: '耗材管理' },
    { path: '/equipment', label: '設備管理' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          AquaCircle
        </Link>
        <ul className="navbar-menu">
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

