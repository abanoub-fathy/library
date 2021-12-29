const $nav = document.querySelector("header .container nav");
const $bars = document.querySelector("header .bars");

$bars.addEventListener("click", () => {
  $nav.classList.toggle("show");
});
