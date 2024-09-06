const fm = document.getElementById("sear") as HTMLFormElement;
const input = document.getElementById("input") as HTMLFormElement;
fm.addEventListener("submit", (event) => {
  event.preventDefault();
  localStorage.setItem("@lunar/gourl", input.value.trim());
});
