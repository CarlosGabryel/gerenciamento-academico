const express = require('express');
const Aluno = require('../models/Aluno');
const AlunoDisciplina = require('../models/AlunoDisciplina');  // Para o relacionamento
const router = express.Router();

// Criar aluno
router.post('/alunos', async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    await aluno.save();
    res.status(201).send(aluno);
  } catch (error) {
    console.log("Erro ao criar aluno:", error);
    res.status(400).send(error);
  }
});

// Obter todos os alunos
router.get('/alunos', async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.status(200).send(alunos);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obter aluno por ID
router.get('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) {
      return res.status(404).send('Aluno não encontrado');
    }
    res.status(200).send(aluno);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Atualizar aluno
router.put('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!aluno) {
      return res.status(404).send('Aluno não encontrado');
    }
    res.status(200).send(aluno);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Deletar aluno
router.delete('/alunos/:id', async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    if (!aluno) {
      return res.status(404).send('Aluno não encontrado');
    }
    res.status(200).send('Aluno deletado');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
