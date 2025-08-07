// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css'; // Estilos específicos da Navbar

const Navbar = () => {
  return (
    <header className="app-header">
      <nav className="app-nav">
        <NavLink to="/" className="nav-link">Alunos</NavLink>
        <NavLink to="/disciplinas" className="nav-link">Disciplinas</NavLink>
        <NavLink to="/alocacao" className="nav-link">Alocação</NavLink> {/* LINHA ADICIONADA */}
      </nav>
    </header>
  );
};
export default Navbar;