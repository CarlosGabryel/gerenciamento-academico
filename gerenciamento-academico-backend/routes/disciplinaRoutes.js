const express = require('express');
const Disciplina = require('../models/Disciplina');
const router = express.Router();

// Criar disciplina
router.post('/disciplinas', async (req, res) => {
  try {
    const disciplina = new Disciplina(req.body);
    await disciplina.save();
    res.status(201).send(disciplina);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obter todas as disciplinas
router.get('/disciplinas', async (req, res) => {
  try {
    const disciplinas = await Disciplina.find();
    res.status(200).send(disciplinas);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obter disciplina por ID
router.get('/disciplinas/:id', async (req, res) => {
  try {
    const disciplina = await Disciplina.findById(req.params.id);
    if (!disciplina) {
      return res.status(404).send('Disciplina não encontrada');
    }
    res.status(200).send(disciplina);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Atualizar disciplina
router.put('/disciplinas/:id', async (req, res) => {
  try {
    const disciplina = await Disciplina.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!disciplina) {
      return res.status(404).send('Disciplina não encontrada');
    }
    res.status(200).send(disciplina);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Deletar disciplina
router.delete('/disciplinas/:id', async (req, res) => {
  try {
    const disciplina = await Disciplina.findByIdAndDelete(req.params.id);
    if (!disciplina) {
      return res.status(404).send('Disciplina não encontrada');
    }
    res.status(200).send('Disciplina deletada');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
