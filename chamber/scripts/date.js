const yearElement = document.querySelector("#current-year");
const modifiedElement = document.querySelector("#lastModified");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

if (modifiedElement) {
    modifiedElement.textContent = `Last modified: ${document.lastModified}`;
}
