// src/components/AlunoForm.js
import React from 'react';
import { useForm } from '../hooks/useForm'; // Usaremos um hook customizado (abaixo)

const AlunoForm = ({ alunoToEdit, onFormSubmit, onCancel }) => {
  const initialState = alunoToEdit || {
    nome: '',
    email: '',
    matricula: '',
    curso: '',
    endereco: '',
    dataNascimento: '',
    cpf: '',
    telefone: '',
  };

  const { values, handleChange } = useForm(initialState);

  // Formata a data para o formato YYYY-MM-DD, que o input type="date" espera
  const formattedDate = values.dataNascimento ? new Date(values.dataNascimento).toISOString().split('T')[0] : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="aluno-form">
      <input
        name="nome"
        type="text"
        placeholder="Nome Completo"
        value={values.nome}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
        required
      />
      <div className="form-row">
        <input
          name="matricula"
          type="text"
          placeholder="Matrícula"
          value={values.matricula}
          onChange={handleChange}
          required
        />
        <input
          name="cpf"
          type="text"
          placeholder="CPF"
          value={values.cpf}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <input
          name="curso"
          type="text"
          placeholder="Curso"
          value={values.curso}
          onChange={handleChange}
        />
        <input
          name="telefone"
          type="text"
          placeholder="Telefone"
          value={values.telefone}
          onChange={handleChange}
        />
      </div>
      <input
        name="endereco"
        type="text"
        placeholder="Endereço"
        value={values.endereco}
        onChange={handleChange}
      />
      <input
        name="dataNascimento"
        type="date"
        placeholder="Data de Nascimento"
        value={formattedDate}
        onChange={handleChange}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {alunoToEdit ? 'Atualizar Aluno' : 'Adicionar Aluno'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AlunoForm;   