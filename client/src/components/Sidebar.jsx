import {
  FiGrid,
  FiAlertTriangle,
  FiActivity,
  FiMonitor,
  FiGlobe,
  FiSearch,
  FiTarget,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiShield,
  FiZap
} from "react-icons/fi";

import { NavLink } from "react-router-dom";


function Sidebar() {

  const menuItems = [

    {
      name: "Overview",
      path: "/",
      icon: <FiGrid />
    },

    {
      name: "Security Alerts",
      path: "/alerts",
      icon: <FiAlertTriangle />
    },

    {
      name: "Events",
      path: "/events",
      icon: <FiActivity />
    },

    {
      name: "Agents",
      path: "/agents",
      icon: <FiMonitor />
    },

    {
      name: "Network",
      path: "/network",
      icon: <FiGlobe />
    },

    {
      name: "Threat Hunting",
      path: "/threat-hunting",
      icon: <FiSearch />
    },

    {
      name: "Attack Scenarios",
      path: "/scenarios",
      icon: <FiTarget />
    },

    {
      name: "Incidents",
      path: "/incidents",
      icon: <FiFileText />
    },

    {
      name: "SOAR Response",
      path: "/response",
      icon: <FiShield />
    },

    {
      name: "Analytics",
      path: "/analytics",
      icon: <FiBarChart2 />
    },

    {
      name: "Reports",
      path: "/reports",
      icon: <FiFileText />
    }

  ];


  return (

    <aside className="sidebar">

      <div className="sidebar-logo">

        <div className="logo-icon">
          <FiShield />
        </div>

        <div>
          <h2>Network Defense</h2>
          <span>SOC PLATFORM</span>
        </div>

      </div>


      <nav className="sidebar-nav">

        <p className="nav-title">
          SECURITY OPERATIONS
        </p>


        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
          >

            <span className="nav-icon">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>

          </NavLink>

        ))}


        <p className="nav-title settings-title">
          SYSTEM
        </p>


        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive
              ? "nav-item active"
              : "nav-item"
          }
        >

          <span className="nav-icon">
            <FiSettings />
          </span>

          <span>
            Settings
          </span>

        </NavLink>

      </nav>


      <div className="sidebar-footer">

        <div className="connection-status">

          <span className="status-dot"></span>

          <div>
            <strong>System Online</strong>
            <small>Simulation Engine</small>
          </div>

        </div>

      </div>

    </aside>

  );

}


export default Sidebar;