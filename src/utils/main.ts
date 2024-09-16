const input = document.getElementById("input") as HTMLInputElement;

document.getElementById("sear")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = input.value.trim();
  const regex = /^(https?:\/\/)/;

  let url: string;

  if (regex.test(value)) {
    url = value;
  } else {
    url = `https://${value}`;
    if (!/^https?:\/\/.+$/.test(url)) {
      url = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    }
  }
  // @ts-ignore
  localStorage.setItem("@lunar/gourl", `/p/${config.encodeUrl(url)}`);
  window.location.href = "./go";
});
