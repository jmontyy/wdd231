const hamburger = document.querySelector("#hamburger");
const hamburgermenu = document.querySelector("#hamburger-menu");

hamburger.addEventListener("click", () => {
    hamburgermenu.classList.toggle("open");
});
