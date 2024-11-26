const express = require('express')
require('dotenv').config();
const mongoose = require('mongoose');



const app = express()
const cors = require('cors');
const port = 3000
app.use(express.json());
app.use(cors());

(async () => {
  try {
    const dblogin = process.env.DB_LOGIN;
    const dbpass = process.env.DB_SENHA;

    // String de conexão ao MongoDB
    const connectionString = `mongodb+srv://${dblogin}:${dbpass}@cluster0.s0usx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    // Tentativa de conexão
    await mongoose.connect(connectionString);
    console.log('Conexão ao banco de dados realizada com sucesso!');

  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  }
})(); 


const Produto = mongoose.model('Produto', {
  nome: String,
  quantidade: Number
});

app.post('/produtos', async (req, res) => {
  const produto = new Produto({
    nome: req.body.nome,
    quantidade: req.body.quantidade
  })
  await produto.save().then(() => console.log('produto adicionado'));
  res.send(produto)
})

// Rota para listar todos os produtos
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find(); // Busca todos os produtos no banco
    res.json(produtos); // Retorna os produtos em formato JSON
    console.log('Produtos listados!')
  } catch (err) {
    res.status(500).send('Erro ao buscar produtos');
    console.log("Erro ao listar produtos!")
  }
});

// Rota para buscar um produto por ID
app.get('/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id); // Busca pelo ID
    if (!produto) return res.status(404).send('Produto não encontrado');
    res.json(produto);
  } catch (err) {
    res.status(500).send('Erro ao buscar produto');
  }
});

app.put('/produtos/:id', async (req, res) => {
  try {
    const { metodo } = req.body;
    let valor
    if(metodo == true){
      valor = 1
    }else{
      valor = -1
    }
    const produtoAtualizado = await Produto.findByIdAndUpdate(
      req.params.id, // ID do produto a ser atualizado
      {
        $inc: { quantidade: valor },
      },
      { new: true } // Retorna o produto atualizado
    );

    if (!produtoAtualizado) return res.status(404).send('Produto não encontrado');
    res.json(produtoAtualizado);
  } catch (err) {
    res.status(500).send('Erro ao atualizar produto');
  }
});

app.delete('/produtos/:id', async (req, res) => {
  try {
    const produtoRemovido = await Produto.findByIdAndDelete(req.params.id); // Remove o produto pelo ID
    if (!produtoRemovido) return res.status(404).send('Produto não encontrado');
    res.send('Produto removido com sucesso');
  } catch (err) {
    res.status(500).send('Erro ao remover produto');
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})