// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Importar os componentes essenciais de autenticação
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Importar os componentes de página
import Navbar from './components/Navbar';
import AlunoPage from './components/AlunoPage';
import DisciplinaPage from './components/DisciplinaPage';
import AlocacaoPage from './components/AlocacaoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import '../src/styles/app.css'; 

const App = () => {
  return (
    // 2. Envolver toda a aplicação com o AuthProvider
    // Isso garante que todos os componentes filhos possam usar o hook useAuth()
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            {/* --- ROTAS PÚBLICAS --- */}
            {/* O usuário pode acessar estas páginas sem estar logado */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> 
            
            {/* --- ROTAS PROTEGIDAS --- */}
            {/* O usuário só pode acessar estas páginas se estiver logado. */}
            {/* O componente ProtectedRoute faz a verificação. */}
            <Route 
              path="/" 
              element={<ProtectedRoute><AlunoPage /></ProtectedRoute>} 
            />
            <Route 
              path="/disciplinas" 
              element={<ProtectedRoute><DisciplinaPage /></ProtectedRoute>} 
            />
            <Route 
              path="/alocacao" 
              element={<ProtectedRoute><AlocacaoPage /></ProtectedRoute>} 
            />

            {/* --- REDIRECIONAMENTO --- */}
            {/* Se o usuário tentar acessar uma rota que não existe, ele é redirecionado para a home. */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;