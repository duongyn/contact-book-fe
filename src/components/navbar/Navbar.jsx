import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React from 'react';
import ValidatedChangePasswordForm from '../changepassword/ValidatedChangePasswordForm';

function Navbar(props) {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const handleCloseLogout = () => {
    setShowLogout(false);
  };
  const handleLogout = () => {
    setShowLogout(false);
    localStorage.clear();
    window.location.href = '/';
  };
  const logoutModal = (
    <Modal show={showLogout} onHide={handleCloseLogout}>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Do you want to log out?</div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex mx-4 flex-row-reverse">
          <Button variant="" onClick={handleCloseLogout}>
            Cancel
          </Button>
          <Button
            className="d-flex mx-3 text-light bg-danger shadow-none border border-danger"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );

  const [show, setShow] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    setShow(false);
    setIsSubmitted(false);
  };

  const successModal = (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Change password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Your password has been changed successfully!</div>
      </Modal.Body>
    </Modal>
  );

  const changePasswordModal = (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Change password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ValidatedChangePasswordForm
          show={show}
          setShow={setShow}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
        />
      </Modal.Body>
    </Modal>
  );

  const handleChangePassword = () => setShow(true);

  const handleChangeLogout = event => {
    event.preventDefault();
    setShowLogout(true);
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg "
        style={{ backgroundColor: 'rgb(171, 42, 22)', marginBottom: '30px' }}
      >
        <div className="container-fluid container-fluid-custom">
          <a className="navbar-brand navbar-brand-custom">
            {props.title}
          </a>
          <div id="navbarSupportedContent" className="support-content">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link"
                  style={{ width: '300px', textAlign: 'center', paddingTop: '8px', color: 'white', fontSize: '20px' }}
                >
                  Chào mừng <strong>{props.username}</strong>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link"
                  style={{ width: '150px', textAlign: 'center', paddingTop: '8px', color: 'white', fontSize: '20px' }}
                  onClick={handleLogout}>Đăng xuất</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
