"use strict";

const routes = {
  "/": `
    <section class="container hero grid-12" id="apresentacao">
      <div class="hero-texto">
        <h1>ONG Mãos Solidárias</h1>
        <h2>Quem Somos</h2>
        <p class="lead">
          A ONG Mãos Solidárias atua na arrecadação e distribuição de alimentos e roupas.
          Nosso objetivo é desenvolver ações solidárias e incentivar a participação da comunidade.
        </p>
        <p>
          <a class="btn" href="/cadastro" data-route>Quero ser voluntário</a>
        </p>
      </div>

      <picture class="hero-imagem">
        <source
          type="image/webp"
          srcset="../imagens/ong-pequena.webp 600w, ../imagens/ong.webp 1200w"
          sizes="(min-width:800px) 45vw, 92vw"
        >
        <img
          src="../imagens/ong.jpg"
          width="1200"
          height="675"
          alt="Voluntários da ONG realizando uma ação solidária"
        >
      </picture>
    </section>

    <div class="container">
      <section id="missao">
        <h2>Nossa Missão</h2>
        <p>
          Arrecadar e distribuir alimentos, roupas e itens essenciais para pessoas
          e famílias em situação de vulnerabilidade, promovendo solidariedade,
          dignidade e apoio à comunidade.
        </p>
      </section>

      <section id="contato">
        <h2>Entre em Contato</h2>
        <address>
          <p><strong>E-mail:</strong>
            <a href="mailto:contato@maossolidarias.org.br">
              contato@maossolidarias.org.br
            </a>
          </p>
          <p><strong>Telefone:</strong>
            <a href="tel:+5516999999999">(16) 99999-9999</a>
          </p>
          <p><strong>Endereço:</strong> Rua da Solidariedade, 100 - São Paulo/SP</p>
        </address>
      </section>
    </div>
  `,

  "/projetos": `
    <section class="container">
      <h1>Projetos</h1>
      <p>Conheça os projetos desenvolvidos pela nossa ONG.</p>
    </section>
  `,

  "/cadastro": `
    <section class="container">
      <h1>Cadastro</h1>
      <p>Faça seu cadastro para participar como voluntário.</p>
    </section>
  `,

  "/contato": `
    <section class="container">
      <h1>Contato</h1>
      <p>Entre em contato com a nossa equipe.</p>
    </section>
  `
};


const app = document.getElementById("app");

function renderRoute(path) {
  app.innerHTML =
    routes[path] ||
    `
      <section class="container">
        <h1>Página não encontrada</h1>
        <p>A página solicitada não existe.</p>
      </section>
    `;
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-route]");

  if (!link) return;

  event.preventDefault();

  const path = link.getAttribute("href");

  history.pushState({}, "", path);

  renderRoute(path);
});

window.addEventListener("popstate", () => {
  const caminho =
    window.location.pathname.endsWith("index.html")
      ? "/"
      : window.location.pathname;

  renderRoute(caminho);
});

const caminhoInicial =
  window.location.pathname.endsWith("index.html")
    ? "/"
    : window.location.pathname;

renderRoute(caminhoInicial);

const botaoTema = document.getElementById("tema-toggle");

function atualizarTema() {
  const modoEscuroAtivo =
    document.body.classList.contains("modo-escuro");

  botaoTema.setAttribute(
    "aria-pressed",
    modoEscuroAtivo
  );

  botaoTema.textContent = modoEscuroAtivo
    ? "Modo claro"
    : "Modo escuro";
}

if (carregarPreferenciaTema()) {
  document.body.classList.add("modo-escuro");
  atualizarTema();
}

botaoTema.addEventListener("click", () => {
  document.body.classList.toggle("modo-escuro");

  const modoEscuroAtivo =
    document.body.classList.contains("modo-escuro");

  salvarPreferenciaTema(modoEscuroAtivo);
  atualizarTema();
});