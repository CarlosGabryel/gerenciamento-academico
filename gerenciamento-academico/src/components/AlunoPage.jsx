// src/components/AlunoPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AlunoForm from './AlunoForm'; // Nosso novo formulário
import Modal from './Modal'; // Um componente de modal reutilizável

// Ícones para os botões (ex: usando react-icons)
// npm install react-icons
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/alunos';

const AlunoPage = () => {
  const [alunos, setAlunos] = useState([]);
  const [editingAluno, setEditingAluno] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlunos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setAlunos(response.data);
    } catch (err) {
      setError('Falha ao carregar os alunos. Tente novamente mais tarde.');
      console.error('Erro ao carregar alunos', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAluno(null);
  };

  const handleFormSubmit = async (alunoData) => {
    try {
      if (editingAluno) {
        // Atualizar aluno
        const response = await axios.put(`${API_URL}/${editingAluno._id}`, alunoData);
        setAlunos(alunos.map((aluno) => (aluno._id === editingAluno._id ? response.data : aluno)));
      } else {
        // Adicionar novo aluno
        const response = await axios.post(API_URL, alunoData);
        setAlunos([...alunos, response.data]);
      }
      closeModal();
    } catch (err) {
      setError('Erro ao salvar o aluno.');
      console.error('Erro ao salvar aluno', err);
    }
  };

  const handleAlunoDeleted = async (id) => {
    if (window.confirm('Você tem certeza que deseja excluir este aluno?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setAlunos(alunos.filter((aluno) => aluno._id !== id));
      } catch (err) {
        setError('Erro ao excluir o aluno.');
        console.error('Erro ao excluir aluno', err);
      }
    }
  };
  
  // 🐛 CORREÇÃO IMPORTANTE: Evita o problema de fuso horário com datas
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Gerenciamento de Alunos</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Adicionar Aluno
        </button>
      </div>
      
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <div className="loader">Carregando...</div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Matrícula</th>
                <th>Curso</th>
                <th>Data de Nasc.</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno._id}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>{aluno.matricula}</td>
                  <td>{aluno.curso}</td>
                  <td>{formatDate(aluno.dataNascimento)}</td>
                  <td className="actions-cell">
                    <button className="icon-button" onClick={() => { setEditingAluno(aluno); setIsModalOpen(true); }}>
                      <FaEdit />
                    </button>
                    <button className="icon-button danger" onClick={() => handleAlunoDeleted(aluno._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <h2>{editingAluno ? 'Editar Aluno' : 'Adicionar Novo Aluno'}</h2>
          <AlunoForm
            alunoToEdit={editingAluno}
            onFormSubmit={handleFormSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default AlunoPage;