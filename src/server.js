require('dotenv').config();
const express = require('express');

const authRoutes = require('./routes/auth');
const produtosRoutes = require('./routes/produtos');
const autenticar = require('./middleware/auth');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'API de produtos no ar' }));

app.use('/auth', authRoutes);
app.use('/produtos', autenticar, produtosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`API rodando na porta ${PORT}`));