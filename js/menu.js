const botaoMenu = document.querySelector(".menu-toggle");
const menuPrincipal = document.querySelector(".menu-list");

if (botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener("click", () => {
        const aberto = menuPrincipal.classList.toggle("aberto");

        botaoMenu.setAttribute("aria-expanded", aberto);
    });
}