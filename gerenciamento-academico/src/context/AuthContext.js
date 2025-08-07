import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Importação corrigida

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        // Decodifica o token para obter os dados do usuário
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        // Configura o cabeçalho do axios para todas as futuras requisições
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        // Se o token for inválido, limpa tudo
        console.error("Token inválido:", error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  
  const register = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/register`, { email, password });
    const { token: newToken } = response.data;
    
    // Loga o usuário automaticamente após o registro
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const login = async (email, password) => {
    // A função de login agora faz a chamada e atualiza o estado
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    const { token: newToken } = response.data;
    
    localStorage.setItem('token', newToken);
    setToken(newToken); // Isso vai disparar o useEffect para decodificar o token e setar o usuário
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const authValues = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authValues}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto
export function useAuth() {
  return useContext(AuthContext);
}