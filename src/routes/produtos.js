const express = require('express');
const pool = require('../db');

const router = express.Router();

function validar(body) {
  const { nome, preco, estoque } = body;
  if (!nome || typeof nome !== 'string') return 'Campo "nome" é obrigatório';
  if (preco === undefined || isNaN(preco) || Number(preco) < 0) return 'Campo "preco" deve ser um número >= 0';
  if (estoque !== undefined && (!Number.isInteger(Number(estoque)) || Number(estoque) < 0)) return 'Campo "estoque" deve ser inteiro >= 0';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM produtos ORDER BY id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM produtos WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
});

router.post('/', async (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  const { nome, preco, estoque = 0, categoria = null } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO produtos (nome, preco, estoque, categoria) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, preco, estoque, categoria]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar produto' });
  }
});

router.put('/:id', async (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  const { nome, preco, estoque = 0, categoria = null } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE produtos SET nome = $1, preco = $2, estoque = $3, categoria = $4 WHERE id = $5 RETURNING *',
      [nome, preco, estoque, categoria, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM produtos WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover produto' });
  }
});

module.exports = router;