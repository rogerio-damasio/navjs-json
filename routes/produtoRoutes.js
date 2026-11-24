const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

// Caminho do arquivo JSON
const arquivo = path.join(__dirname, "../data/produtos.json");

// Função para ler os dados
function lerProdutos() {
    const dados = fs.readFileSync(arquivo, "utf8");
    return JSON.parse(dados);
}

// Função para salvar os dados
function salvarProdutos(produtos) {
    fs.writeFileSync(
        arquivo,
        JSON.stringify(produtos, null, 4)
    );
}

//READ
router.get("/", (req, res) => {
  const produtos = lerProdutos();
  res.render("produtos/index", {
    produtos: produtos
  });
});

//FORMS
router.get("/cadastro", (req, res) => {
  res.render("produtos/form-cadastro",)
});

//SALVAR
router.post("/", (req, res) => {
  const produtos = lerProdutos();
  const { nome, descricao, preco, estoque, categoria } = req.body;
  const novaProduto = {
    id: produtos.length + 1,
    nome: nome,
    descricao: descricao,
    preco: preco,
    estoque: estoque,
    categoria: categoria
  };
  produtos.push(novaProduto);
  salvarProdutos(produtos);
  res.redirect("/produtos");
});

//Excluir
router.get("/excluir/:id", (req, res) =>{
  const produtos = lerProdutos();
  let id = parseInt(req.params.id);
  const novosProdutos = produtos.filter(c => c.id !== id);
  salvarProdutos(novosProdutos);
  res.redirect("/produtos");
});

//Editar - form - GET
router.get("/editar/:id", (req, res) =>{
  const produtos = lerProdutos();
  let id = parseInt(req.params.id);
  let produto = produtos.find(c => c.id === id)

  if(!produto){
    return res.redirect("/produtos");
  }

  res.render("produtos/editar", {produto});
});

//Editar - efetiva - POST
router.post("/editar/:id", (req, res) =>{
  const produtos = lerProdutos();
  let id = parseInt(req.params.id);
  const { nome, descricao, preco, estoque, categoria } = req.body;
  let produto = produtos.find(c => c.id === id);
  produto.nome = nome;
  produto.descricao = descricao;
  produto.preco = preco;
  produto.estoque = estoque;
  produto.categoria = categoria;
  salvarProdutos(produtos);
  res.redirect("/produtos");
});

module.exports = router;
