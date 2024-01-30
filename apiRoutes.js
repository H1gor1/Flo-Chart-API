const express = require('express');
const router = express.Router();
const { getFormattedMusicas } = require('./dataRequest');

router.get('/musicsFlo', async (req, res) => {
  try {
    const musicsFlo = await getFormattedMusicas();
    res.json(musicsFlo);
  } catch (error) {
    console.error('Erro ao obter dados da API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;