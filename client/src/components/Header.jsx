import {
  FiSearch,
  FiBell,
  FiUser
} from "react-icons/fi";


function Header() {

  return (

    <header className="top-header">

      <div className="header-title">

        <div className="security-indicator">
          <span></span>
        </div>

        <div>
          <h3>Security Operations Center</h3>
          <p>Network Defense Monitoring</p>
        </div>

      </div>


      <div className="header-actions">

        <div className="search-box">

          <FiSearch />

          <input
            type="text"
            placeholder="Search events, alerts..."
          />

          <span className="search-shortcut">
            /
          </span>

        </div>


        <button className="icon-button">

          <FiBell />

          <span className="notification-dot"></span>

        </button>


        <div className="user-profile">

          <div className="user-avatar">
            SOC
          </div>

          <div className="user-info">
            <strong>Security Analyst</strong>
            <span>Administrator</span>
          </div>

        </div>

      </div>

    </header>

  );

}


export default Header;