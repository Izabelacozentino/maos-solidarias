"use strict";
const $ = (id) => document.getElementById(id);
const digitos = (v) => v.replace(/\D/g, "");

/* Máscaras */
const mascaras = {
  cpf: (v) => digitos(v).slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
  telefone: (v) => {
    const d = digitos(v).slice(0, 11);
    if (d.length <= 2) return d ? `(${d}` : "";
    const meio = d.length > 10 ? 5 : 4;
    return d.length <= meio + 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}`
      : `(${d.slice(0, 2)}) ${d.slice(2, 2 + meio)}-${d.slice(2 + meio)}`;
  },
  cep: (v) => digitos(v).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"),
};
for (const [id, fn] of Object.entries(mascaras)) {
  $(id).addEventListener("input", (e) => { e.target.value = fn(e.target.value); e.target.setCustomValidity(""); });
}

/* Validações específicas */
function cpfValido(cpf) {
  const d = digitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  for (const t of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += +d[i] * (t + 1 - i);
    if (((soma * 10) % 11) % 10 !== +d[t]) return false;
  }
  return true;
}
function maior18(data) {
  const n = new Date(data), h = new Date();
  h.setFullYear(h.getFullYear() - 18);
  return !isNaN(n) && n <= h;
}
function validarCustom() {
  $("cpf").setCustomValidity($("cpf").value && !cpfValido($("cpf").value) ? "CPF inválido. Confira os números." : "");
  $("nascimento").setCustomValidity($("nascimento").value && !maior18($("nascimento").value) ? "É necessário ter 18 anos ou mais." : "");
  const marcado = document.querySelectorAll('input[name="area"]:checked').length > 0;
  document.querySelector('input[name="area"]').setCustomValidity(marcado ? "" : "Escolha ao menos uma área.");
}

/* Mensagens de erro em português */
function mensagem(campo) {
  const v = campo.validity;
  if (v.valid) return "";
  if (v.customError) return campo.validationMessage;
  if (v.valueMissing) return campo.type === "checkbox" ? "Marque esta opção para continuar." : "Preencha este campo.";
  if (v.typeMismatch) return "Informe um e-mail válido, como voce@exemplo.com.";
  if (v.tooShort) return `Digite ao menos ${campo.minLength} caracteres.`;
  if (v.patternMismatch) return campo.title || "Formato inválido.";
  return "Valor inválido.";
}
function mostrarErro(campo) {
  const id = campo.name === "area" ? "erro-area" : `erro-${campo.id}`;
  const alvo = $(id);
  if (!alvo) return;
  const msg = mensagem(campo);
  alvo.textContent = msg;
  campo.classList.toggle("invalido", !!msg);
  campo.setAttribute("aria-invalid", msg ? "true" : "false");
}

const form = $("form-cadastro");

if (form) {
 form.querySelectorAll("input, select, textarea").forEach((c) => {
  c.addEventListener("blur", () => { validarCustom(); mostrarErro(c); });
  c.addEventListener("input", () => { if (c.classList.contains("invalido")) { validarCustom(); mostrarErro(c); } });
  c.addEventListener("change", () => { validarCustom(); mostrarErro(c); });
});

/* CEP: preenche endereço via ViaCEP (opcional; falha sem travar o formulário) */
$("cep").addEventListener("blur", async () => {
  const cep = digitos($("cep").value);
  if (cep.length !== 8) return;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d = await r.json();
    if (d.erro) { $("cep").setCustomValidity("CEP não encontrado."); mostrarErro($("cep")); return; }
    if (!$("logradouro").value) $("logradouro").value = d.logradouro;
    $("cidade").value = d.localidade; $("uf").value = d.uf;
  } catch { /* sem conexão: o usuário preenche manualmente */ }
});

/* Envio */

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validarCustom();
  const status = $("status");
  if (!form.checkValidity()) {
    const invalidos = [...form.elements].filter((c) => c.willValidate && !c.validity.valid);
    invalidos.forEach(mostrarErro);
    invalidos[0].focus();
    status.hidden = true;
    return;
  }
  // NOVO: pegar os dados
  const dados = obterDadosFormulario();

  // NOVO: salvar no localStorage
  salvarDadosFormulario(dados);

  status.hidden = false;
  status.textContent = `Obrigado, ${$("nome").value.split(" ")[0]}! Seu cadastro foi recebido. Entraremos em contato em breve.`;
  form.reset();
  form.querySelectorAll(".erro").forEach((s) => (s.textContent = ""));
});
form.addEventListener("reset", () => {
  form.querySelectorAll(".invalido").forEach((c) => c.classList.remove("invalido"));
  $("status").hidden = true;
});
}

/* Menu hambúrguer */
const botaoMenu = document.querySelector(".menu-toggle");
const menuPrincipal = document.querySelector(".menu-list");

if (botaoMenu && menuPrincipal) {
  botaoMenu.addEventListener("click", () => {
    const aberto = menuPrincipal.classList.toggle("aberto");
    botaoMenu.setAttribute("aria-expanded", aberto);
  });
}