import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

export default function ButtonComponent({ name, link }) {
  return (
    <Link to={link}>
      <button type="button" style={{ paddingTop: '6px' }} className="create_button">
        {name}
      </button>
    </Link>
  );
}
