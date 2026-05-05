import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Clock, PieChart, Plus } from 'lucide-react';

interface NavBarProps {
  onAddClick: () => void;
}

export default function NavBar({ onAddClick }: NavBarProps) {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          id="nav-home"
          aria-label="Home"
          end
        >
          <Home />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          id="nav-history"
          aria-label="History"
        >
          <Clock />
          <span>History</span>
        </NavLink>

        <button
          className="nav-fab"
          onClick={onAddClick}
          aria-label="Add new transaction"
          id="nav-add-btn"
        >
          <Plus />
        </button>

        <NavLink
          to="/overview"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          id="nav-overview"
          aria-label="Overview"
        >
          <PieChart />
          <span>Overview</span>
        </NavLink>

        <div className="nav-item" style={{ visibility: 'hidden', pointerEvents: 'none' }}>
          <Home />
          <span>More</span>
        </div>
      </div>
    </nav>
  );
}
