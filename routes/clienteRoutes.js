const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

// Caminho do arquivo JSON
const arquivo = path.join(__dirname, "../data/clientes.json");

// Função para ler os dados
function lerClientes() {
    const dados = fs.readFileSync(arquivo, "utf8");
    return JSON.parse(dados);
}

// Função para salvar os dados
function salvarClientes(clientes) {
    fs.writeFileSync(
        arquivo,
        JSON.stringify(clientes, null, 4)
    );
}

//READ
router.get("/", (req, res) => {
  const clientes = lerClientes();
  res.render("clientes/index", {
    clientes: clientes
  });
});

//FORMS
router.get("/cadastro", (req, res) => {
  res.render("clientes/form-cadastro",)
});

//SALVAR
router.post("/", (req, res) => {
  const clientes = lerClientes();
  const { nome, email, telefone, cidade } = req.body;
  const novaCliente = {
    id: clientes.length + 1,
    nome: nome,
    email: email,
    telefone: telefone,
    cidade: cidade
  };
  clientes.push(novaCliente);
  salvarClientes(clientes);
  res.redirect("/clientes");
});

//Excluir
router.get("/excluir/:id", (req, res) =>{
  const clientes = lerClientes();
  let id = parseInt(req.params.id);
  const novosClientes = clientes.filter(c => c.id !== id);
  salvarClientes(novosClientes);
  res.redirect("/clientes");
});

//Editar - form - GET
router.get("/editar/:id", (req, res) =>{
  const clientes = lerClientes();
  let id = parseInt(req.params.id);
  let cliente = clientes.find(c => c.id === id)

  if(!cliente){
    return res.redirect("/clientes");
  }

  res.render("clientes/editar", {cliente});
});

//Editar - efetiva - POST
router.post("/editar/:id", (req, res) =>{
  const clientes = lerClientes();
  let id = parseInt(req.params.id);
  const { nome, email, telefone, cidade } = req.body;
  let cliente = clientes.find(c => c.id === id);
  cliente.nome = nome;
  cliente.email = email;
  cliente.telefone = telefone;
  cliente.cidade = cidade;
  salvarClientes(clientes);
  res.redirect("/clientes");
});

module.exports = router;
