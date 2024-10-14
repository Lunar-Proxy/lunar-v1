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
  event.preventDefault();

  let value = input.value.trim();
  let url = value;
  const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;

  if (regex.test(value)) {
    if (!/^https?:\/\//i.test(value)) {
      url = `https://${value}`;
    }
  } else {
    url = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
  }

  localStorage.setItem("@lunar/gourl", `/us/${config.encodeUrl(url)}`);
  window.location.href = "./g";
});
