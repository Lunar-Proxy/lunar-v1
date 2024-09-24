const fm = document.getElementById("sear") as HTMLFormElement;
const input = document.getElementById("input") as HTMLInputElement;

fm.addEventListener("submit", (event) => {
  event.preventDefault();
  let value = input.value.trim();
  let url = value;
  let regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;

  if (regex.test(value)) {
    if (!/^https?:\/\//i.test(value)) {
      url = `https://${value}`;
    }
  } else {
    url = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
  }

  localStorage.setItem("@lunar/gourl", `/p/${config.encodeUrl(url)}`);
  window.location.href = "./g";
});
