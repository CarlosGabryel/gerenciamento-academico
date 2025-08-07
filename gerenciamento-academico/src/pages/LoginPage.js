import React, { useState } from 'react';
// Passo 1: Importar o componente 'Link' do react-router-dom
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      console.error("Erro no login:", err);
      setError('Email ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="aluno-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn-primary">Entrar</button>
      </form>

      {/* Passo 2: Adicionar o parágrafo com o link para a página de registro */}
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Não tem uma conta? <Link to="/register">Registre-se aqui</Link>
      </p>

    </div>
  );
}

export default LoginPage;