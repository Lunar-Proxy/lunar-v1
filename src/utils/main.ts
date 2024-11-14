
const fm = document.getElementById("sear") as HTMLFormElement;
const input = document.getElementById("input") as HTMLInputElement;
const clearInput = document.getElementById("clear") as HTMLButtonElement;
const search = document.getElementById("search") as HTMLButtonElement;

input.addEventListener("input", () => {
  clearInput.style.display = input.value ? "block" : "none";
});

search.addEventListener("click", () => {
  fm.dispatchEvent(new Event("submit"));
});

clearInput.addEventListener("click", () => {
  input.value = "";
  clearInput.style.display = "none";
  input.focus();
});

fm.addEventListener("submit", (event) => {
  localStorage.setItem("@lunar/gourl", input.value)
  event.preventDefault();
  window.location.href = "./browse";
});
