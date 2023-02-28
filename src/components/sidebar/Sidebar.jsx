import { Link, NavLink } from 'react-router-dom';
import logo from '../../asset/images/logo.jpeg';
import './sidebar.css';
function Sidebar({ renderContent }) {
  let activeStyle = {
    backgroundColor: 'rgb(185, 60, 60)',
    color: 'whitesmoke',
  };
  let inactiveStyle = {
    backgroundColor: '#e4e8eb',
    color: 'black',
  };

  return (
    <>
      <div style={{ width: '280px', display: 'inline-block', marginRight: '50px' }}>
        <div>
          <Link
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
            to="/"
          >
          </Link>
          <p className="title">Quản lý dữ liệu SLLDT</p>
        </div>
        <ul className="nav nav-pills flex-column mb-auto nav-custom">
          {renderContent.map((item, index) => {
            return (
              <NavLink
                key={index}
                className="nav-item  nav-item-custom"
                to={item.route}
                style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
              >
                <p className="navlink-content">{item.content}</p>
              </NavLink>
            );
          })}
        </ul>
      </div>
    </>
  );
}
export default Sidebar;
