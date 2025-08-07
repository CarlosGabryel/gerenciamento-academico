// src/components/DisciplinaForm.js
import React from 'react';
import { useForm } from '../hooks/useForm';

const DisciplinaForm = ({ disciplinaToEdit, onFormSubmit, onCancel }) => {
  // Define o estado inicial: vazio para adicionar, preenchido para editar
  const initialState = disciplinaToEdit || {
    nome: '',
    cargaHoraria: '',
  };

  const { values, handleChange } = useForm(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Garante que a carga horária seja enviada como número
    const dataToSubmit = {
      ...values,
      cargaHoraria: parseInt(values.cargaHoraria, 10) || 0,
    };
    onFormSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="aluno-form">
      <input
        name="nome"
        type="text"
        placeholder="Nome da Disciplina"
        value={values.nome}
        onChange={handleChange}
        required
      />
      <input
        name="cargaHoraria"
        type="number"
        placeholder="Carga Horária (em horas)"
        value={values.cargaHoraria}
        onChange={handleChange}
        required
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {disciplinaToEdit ? 'Atualizar Disciplina' : 'Adicionar Disciplina'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default DisciplinaForm;