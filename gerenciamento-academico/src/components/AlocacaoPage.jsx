// src/components/AlocacaoPage.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { FaTrash, FaPlusCircle } from 'react-icons/fa';

// URLs da API
const API_ALUNOS_URL = 'http://localhost:5000/api/alunos';
const API_DISCIPLINAS_URL = 'http://localhost:5000/api/disciplinas';

// CORREÇÃO: URL base da API para facilitar a montagem das rotas corretas
const API_BASE_URL = 'http://localhost:5000/api';

const AlocacaoPage = () => {
  // Estados para dados gerais
  const [allAlunos, setAllAlunos] = useState([]);
  const [allDisciplinas, setAllDisciplinas] = useState([]);

  // Estados para o aluno selecionado e suas disciplinas
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [disciplinasDoAluno, setDisciplinasDoAluno] = useState([]);
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disciplinaToAloc, setDisciplinaToAloc] = useState('');

  // 1. Busca todos os alunos e disciplinas ao iniciar a página
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [alunosRes, disciplinasRes] = await Promise.all([
          axios.get(API_ALUNOS_URL),
          axios.get(API_DISCIPLINAS_URL),
        ]);
        setAllAlunos(alunosRes.data);
        setAllDisciplinas(disciplinasRes.data);
      } catch (err) {
        setError('Falha ao carregar dados iniciais.');
      }
    };
    fetchInitialData();
  }, []);

  // 2. Busca as disciplinas de um aluno sempre que um novo aluno for selecionado
  useEffect(() => {
    if (!selectedAluno) {
      setDisciplinasDoAluno([]);
      return;
    }

 const fetchDisciplinasDoAluno = async () => {
  setIsLoading(true);
  setError(null);
  try {
    // CORREÇÃO FINAL: Apontar para a nova rota do backend
    const response = await axios.get(`${API_BASE_URL}/alunos/${selectedAluno._id}/disciplinas`);
    
    // O resto do código para processar a resposta continua igual
    const disciplinasPopulated = Array.isArray(response.data)
      ? response.data.map(item => item.disciplinaId).filter(Boolean)
      : [];
    setDisciplinasDoAluno(disciplinasPopulated);

  } catch (err) {
    setError('Falha ao buscar disciplinas do aluno.');
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

    fetchDisciplinasDoAluno();
  }, [selectedAluno]);
  
  // Filtra as disciplinas que o aluno ainda NÃO cursa
  const disciplinasDisponiveis = useMemo(() => {
    if (!selectedAluno) return [];
    const idsDisciplinasCursadas = new Set(disciplinasDoAluno.map(d => d._id));
    return allDisciplinas.filter(d => !idsDisciplinasCursadas.has(d._id));
  }, [disciplinasDoAluno, allDisciplinas, selectedAluno]);


  const handleAlunoSelect = (alunoId) => {
    const aluno = allAlunos.find(a => a._id === alunoId);
    setSelectedAluno(aluno || null);
  };

  const handleAlocar = async (e) => {
    e.preventDefault();
    if (!disciplinaToAloc) return;
    
    try {
      // CORREÇÃO: URL ajustada para a rota correta do backend.
      // ANTES: /api/alocacoes/alocar
      // AGORA: /api/alocar
      await axios.post(`${API_BASE_URL}/alocar`, {
        alunoId: selectedAluno._id,
        disciplinaId: disciplinaToAloc,
      });
      const disciplinaAdicionada = allDisciplinas.find(d => d._id === disciplinaToAloc);
      setDisciplinasDoAluno([...disciplinasDoAluno, disciplinaAdicionada]);
      setIsModalOpen(false);
      setDisciplinaToAloc('');
    } catch (err) {
      setError('Erro ao alocar disciplina.');
      console.error(err); // Adicionado para ver o erro detalhado no console
    }
  };
  
  const handleDesalocar = async (disciplinaId) => {
    if (!window.confirm("Tem certeza que deseja desalocar esta disciplina?")) return;

    try {
      // CORREÇÃO: URL ajustada para a rota correta do backend.
      // ANTES: /api/alocacoes/desalocar
      // AGORA: /api/desalocar
      await axios.delete(`${API_BASE_URL}/desalocar`, {
        data: { alunoId: selectedAluno._id, disciplinaId },
      });
      setDisciplinasDoAluno(disciplinasDoAluno.filter(d => d._id !== disciplinaId));
    } catch (err) {
      setError('Erro ao desalocar disciplina.');
      console.error(err); // Adicionado para ver o erro detalhado no console
    }
  };

  // O restante do código (o JSX para renderização) permanece o mesmo
  // ... (cole o restante do return daqui)
  return (
    <div className="container">
      <div className="page-header">
        <h1>Alocação de Disciplinas</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="selection-area">
        <label htmlFor="aluno-select">Selecione um Aluno:</label>
        <select 
          id="aluno-select" 
          onChange={(e) => handleAlunoSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>-- Escolha um aluno --</option>
          {allAlunos.map(aluno => (
            <option key={aluno._id} value={aluno._id}>
              {aluno.nome} (Matrícula: {aluno.matricula})
            </option>
          ))}
        </select>
      </div>

      {selectedAluno && (
        <div className="disciplina-list">
          <h3>Disciplinas de {selectedAluno.nome}</h3>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <FaPlusCircle /> Alocar Nova Disciplina
          </button>
          {isLoading ? (
            <div className="loader">Carregando...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Disciplina</th>
                  <th>Carga Horária</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {disciplinasDoAluno.length > 0 ? (
                  disciplinasDoAluno.map(disciplina => (
                    <tr key={disciplina._id}>
                      <td>{disciplina.nome}</td>
                      <td>{disciplina.cargaHoraria} horas</td>
                      <td>
                        <button className="icon-button danger" onClick={() => handleDesalocar(disciplina._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">Nenhuma disciplina alocada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2>Alocar Disciplina para {selectedAluno.nome}</h2>
          <form onSubmit={handleAlocar}>
            <select
              required
              defaultValue=""
              onChange={e => setDisciplinaToAloc(e.target.value)}
            >
              <option value="" disabled>-- Selecione uma disciplina --</option>
              {disciplinasDisponiveis.map(d => (
                <option key={d._id} value={d._id}>{d.nome}</option>
              ))}
            </select>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Alocar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AlocacaoPage;