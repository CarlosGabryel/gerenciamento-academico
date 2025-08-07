import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const { register } = useAuth(); // Usaremos a função de registro do nosso contexto
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await register(email, password);
      navigate('/'); // Redireciona para a página principal após o registro bem-sucedido
    } catch (err) {
      // O erro.response.data.message vem da mensagem que definimos no backend
      const errorMessage = err.response?.data?.message || 'Falha ao registrar. Tente novamente.';
      setError(errorMessage);
    }
  };

  return (
    <div className="container">
      <h2>Criar Conta</h2>
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
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirme a Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="btn-primary">Registrar</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Já tem uma conta? <Link to="/login">Faça o login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;