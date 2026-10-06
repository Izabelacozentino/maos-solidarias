"use strict";

function obterDadosFormulario() {
  const dados = {
    nome: document.getElementById("nome").value,
    nascimento: document.getElementById("nascimento").value,
    cpf: document.getElementById("cpf").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    cep: document.getElementById("cep").value,
    logradouro: document.getElementById("logradouro").value,
    cidade: document.getElementById("cidade").value,
    uf: document.getElementById("uf").value,

    areas: [...document.querySelectorAll('input[name="area"]:checked')]
      .map((campo) => campo.value),

    disponibilidade:
      document.querySelector(
        'input[name="disponibilidade"]:checked'
      )?.value || "",

    mensagem: document.getElementById("mensagem").value,
    lgpd: document.getElementById("lgpd").checked
  };

  return dados;
}

function salvarDadosFormulario(dados) {
  localStorage.setItem(
    "voluntario",
    JSON.stringify(dados)
  );
}

function salvarPreferenciaTema(modoEscuro) {
  localStorage.setItem(
    "modo-escuro",
    modoEscuro ? "ativo" : "inativo"
  );
}

function carregarPreferenciaTema() {
  return localStorage.getItem("modo-escuro") === "ativo";
}