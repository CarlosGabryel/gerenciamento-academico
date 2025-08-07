// src/components/DisciplinaPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DisciplinaForm from './DisciplinaForm'; // Nosso novo formulário
import Modal from './Modal';                   // O modal que já criamos
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Ícones

const API_URL = 'http://localhost:5000/api/disciplinas';

const DisciplinaPage = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [editingDisciplina, setEditingDisciplina] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDisciplinas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setDisciplinas(response.data);
    } catch (err) {
      setError('Falha ao carregar as disciplinas. Tente novamente.');
      console.error('Erro ao carregar disciplinas', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDisciplinas();
  }, [fetchDisciplinas]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDisciplina(null);
  };

  const handleFormSubmit = async (disciplinaData) => {
    try {
      if (editingDisciplina) {
        // Atualiza disciplina existente
        const response = await axios.put(`${API_URL}/${editingDisciplina._id}`, disciplinaData);
        setDisciplinas(
          disciplinas.map((d) => (d._id === editingDisciplina._id ? response.data : d))
        );
      } else {
        // Adiciona nova disciplina
        const response = await axios.post(API_URL, disciplinaData);
        setDisciplinas([...disciplinas, response.data]);
      }
      closeModal();
    } catch (err) {
      setError('Erro ao salvar a disciplina.');
      console.error('Erro ao salvar disciplina', err);
    }
  };

  const handleDisciplinaDeleted = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setDisciplinas(disciplinas.filter((d) => d._id !== id));
      } catch (err) {
        setError('Erro ao excluir a disciplina.');
        console.error('Erro ao excluir disciplina', err);
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Gerenciamento de Disciplinas</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Adicionar Disciplina
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
                <th>Nome da Disciplina</th>
                <th>Carga Horária</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {disciplinas.map((disciplina) => (
                <tr key={disciplina._id}>
                  <td>{disciplina.nome}</td>
                  <td>{`${disciplina.cargaHoraria} horas`}</td>
                  <td className="actions-cell">
                    <button
                      className="icon-button"
                      onClick={() => {
                        setEditingDisciplina(disciplina);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={() => handleDisciplinaDeleted(disciplina._id)}
                    >
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
          <h2>{editingDisciplina ? 'Editar Disciplina' : 'Adicionar Nova Disciplina'}</h2>
          <DisciplinaForm
            disciplinaToEdit={editingDisciplina}
            onFormSubmit={handleFormSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default DisciplinaPage;