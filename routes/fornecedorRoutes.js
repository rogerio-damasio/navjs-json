const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

// Caminho do arquivo JSON
const arquivo = path.join(__dirname, "../data/forncedores.json");

// Função para ler os dados
function lerFornecedores() {
    const dados = fs.readFileSync(arquivo, "utf8");
    return JSON.parse(dados);
}

// Função para salvar os dados
function salvarFornecedores(forncedores) {
    fs.writeFileSync(
        arquivo,
        JSON.stringify(forncedores, null, 4)
    );
}

//READ
router.get("/", (req, res) => {
  const fornecedores = lerFornecedores();
  res.render("fornecedores/index", {
    fornecedores: fornecedores
  });
});

//FORMS
router.get("/cadastro", (req, res) => {
  res.render("fornecedores/form-cadastro",)
});

//SALVAR
router.post("/", (req, res) => {
  const fornecedores = lerFornecedores();
  const { razaoSocial, cnpj, email, telefone, cidade } = req.body;
  const novaFornecedor = {
    id: fornecedores.length + 1,
    razaoSocial: razaoSocial,
    cnpj: cnpj,
    email: email,
    telefone: telefone,
    cidade: cidade
  };
  fornecedores.push(novaFornecedor);
  salvarFornecedores(fornecedores);
  res.redirect("/fornecedores");
});

//Excluir
router.get("/excluir/:id", (req, res) =>{
  const fornecedores = lerFornecedores();
  let id = parseInt(req.params.id);
  const novosFornecedores = fornecedores.filter(c => c.id !== id);
  salvarFornecedores(novosFornecedores);
  res.redirect("/fornecedores");
});

//Editar - form - GET
router.get("/editar/:id", (req, res) =>{
  const fornecedores = lerFornecedores();
  let id = parseInt(req.params.id);
  let fornecedor = fornecedores.find(c => c.id === id)

  if(!fornecedor){
    return res.redirect("/fornecedores");
  }

  res.render("fornecedores/editar", {fornecedor});
});

//Editar - efetiva - POST
router.post("/editar/:id", (req, res) =>{
  const fornecedores = lerFornecedores();
  let id = parseInt(req.params.id);
  const { razaoSocial, cnpj, email, telefone, cidade } = req.body;
  let fornecedor = fornecedores.find(c => c.id === id);
  fornecedor.razaoSocial = razaoSocial;
  fornecedor.cnpj = cnpj;
  fornecedor.email = email;
  fornecedor.telefone = telefone;
  fornecedor.cidade = cidade;
  salvarFornecedores(fornecedores);
  res.redirect("/fornecedores");
});

module.exports = router;
