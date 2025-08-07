const express = require('express');
const AlunoDisciplina = require('../models/AlunoDisciplina');
const router = express.Router();

// Alocar disciplina a um aluno
router.post('/alocar', async (req, res) => {
  try {
    const { alunoId, disciplinaId } = req.body;
    const alunoDisciplina = new AlunoDisciplina({ alunoId, disciplinaId });
    await alunoDisciplina.save();
    res.status(201).send(alunoDisciplina);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Exibir disciplinas alocadas a um aluno
router.get('/alunos/:alunoId/disciplinas', async (req, res) => {
  try {
    // A query para o banco de dados permanece a mesma
    const alunoDisciplina = await AlunoDisciplina.find({ alunoId: req.params.alunoId }).populate('disciplinaId');

    // Se não encontrar nada, retorna um array vazio (o que é o correto)
    res.status(200).send(alunoDisciplina);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Desalocar disciplina de um aluno
router.delete('/desalocar', async (req, res) => {
  try {
    const { alunoId, disciplinaId } = req.body;
    await AlunoDisciplina.findOneAndDelete({ alunoId, disciplinaId });
    res.status(200).send('Disciplina desalocada');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
