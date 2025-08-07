const mongoose = require('mongoose');

const disciplinaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cargaHoraria: { type: Number, required: true },
});

const Disciplina = mongoose.model('Disciplina', disciplinaSchema);
module.exports = Disciplina;
