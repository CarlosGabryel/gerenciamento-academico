const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  endereco: String,
  dataNascimento: Date,
  cpf: String,
  matricula: { type: String, required: true, unique: true },
  telefone: String,   
  email: { type: String, required: true },
  curso: String,
});

const Aluno = mongoose.model('Aluno', alunoSchema);
module.exports = Aluno;
