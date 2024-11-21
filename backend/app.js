const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000
app.use(express.json());

mongoose.connect('mongodb+srv://leonardokinouchi:iGCkyAdr8iL0TfD8@cluster0.s0usx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');


const Produto = mongoose.model('Produto', {
  id: Number,
  nome: String,
  quantidade: Number
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/produtos', async (req, res) => {
  const produto = new Produto({
    id: req.body.id,
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
  } catch (err) {
    res.status(500).send('Erro ao buscar produtos');
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
    const produtoAtualizado = await Produto.findByIdAndUpdate(
      req.params.id, // ID do produto a ser atualizado
      {
        nome: req.body.nome, // Novos valores
        quantidade: req.body.quantidade,
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