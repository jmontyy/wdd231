const menuButton = document.querySelector(".nav-toggle");
const mainNav = document.querySelector("#main-nav");

if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");
    });
}
