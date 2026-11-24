const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

// Caminho do arquivo JSON
const arquivo = path.join(__dirname, "../data/categorias.json");

// Função para ler os dados
function lerCategorias() {
    const dados = fs.readFileSync(arquivo, "utf8");
    return JSON.parse(dados);
}

// Função para salvar os dados
function salvarCategorias(categorias) {
    fs.writeFileSync(
        arquivo,
        JSON.stringify(categorias, null, 4)
    );
}

// READ
router.get("/", (req, res) => {
  const categorias = lerCategorias();
  res.render("categorias/index", {
    categorias: categorias
  });
});

//FORMS
router.get("/cadastro", (req, res) => {
  res.render("categorias/form-cadastro",)
});

//Salvar
router.post("/", (req, res) => {
  const categorias = lerCategorias();
  const { nome, descricao } = req.body;
  const novaCategoria = {
    id: categorias.length + 1,
    nome: nome,
    descricao: descricao
  };
  categorias.push(novaCategoria);
  salvarCategorias(categorias);
  res.redirect("/categorias");
});

//Excluir
router.get("/excluir/:id", (req, res) =>{
  const categorias = lerCategorias();
  let id = parseInt(req.params.id);
  const novasCategorias = categorias.filter(c => c.id !== id);
  salvarCategorias(novasCategorias);
  res.redirect("/categorias");
});

//Editar - form - GET
router.get("/editar/:id", (req, res) =>{
  const categorias = lerCategorias();
  let id = parseInt(req.params.id);
  let categoria = categorias.find(c => c.id === id)

  if(!categoria){
    return res.redirect("/categorias");
  }

  res.render("categorias/editar", {categoria});
});

//Editar - efetiva - POST
router.post("/editar/:id", (req, res) =>{ 
  const categorias = lerCategorias();
  let id = parseInt(req.params.id);
  const { nome, descricao } = req.body;
  let categoria = categorias.find(c => c.id === id);
    categoria.nome = nome;
    categoria.descricao = descricao;
    salvarCategorias(categorias);
    res.redirect("/categorias");
});

module.exports = router;
