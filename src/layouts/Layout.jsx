import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import useAuth from '../hooks/useAuth';
import { ADMIN_SIDEBAR, ROLE, STAFF_SIDEBAR } from '../util/enum';
import './layout.css';

function Layout({ title, children }) {
  const { user } = useAuth();

  let role = user.role[0].authority;
  let username = user.sub;

  return (
    <section>
      <Navbar title={title} username={username} />
      <div className="page-wrapper">
        <Sidebar renderContent={role === ROLE.STUDENT ? ADMIN_SIDEBAR : STAFF_SIDEBAR} />

        <div
          style={{
            display: 'inline-block',
            marginLeft: '30px',
            marginTop: '30px',
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export default Layout;
