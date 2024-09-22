async function loadGameList() {
  try {
    const response = await fetch("./assets/json/games.json");

    if (!response.ok) {
      console.error("Error finding the file.");
      return null;
    }

    const gamelist = await response.json();
    return gamelist;
  } catch (error) {
    console.error("Failed to fetch the list of games:", error);
    return null;
  }
}

loadGameList().then((gamelist) => {
  if (gamelist) {
    const gameContainerDiv = document.createElement("div");
    gameContainerDiv.className = "flex flex-wrap justify-start";

    gamelist.forEach((element: Game) => {
      const gamediv = document.createElement("div");
      gamediv.className = "w-1/4 p-2";

      const gameContainer = document.createElement("div");
      gameContainer.className = "relative inline-block overflow-hidden group";

      const game = document.createElement("img");
      game.src = element.logo;
      game.alt = `${element.title}`;
      game.className =
        "h-32 w-40 transition duration-300 ease-in-out transform group-hover:blur-sm";

      const gameName = document.createElement("h3");
      gameName.textContent = element.title;
      gameName.className =
        "text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 font-rubik text-2xl tracking-wide shadow-md"; // Tailwind classes

      gameContainer.appendChild(game);
      gameContainer.appendChild(gameName);
      gamediv.appendChild(gameContainer);
      gameContainerDiv.appendChild(gamediv);

      gameContainerDiv.addEventListener("click", function (event) {
        event.preventDefault();
        if (element.alert) {
          alert(element.alert);
        } else {
          let value = element.website.trim();
          let url = "";
          let regex =
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
          if (regex.test(value)) {
            if (!/^https?:\/\//i.test(url)) {
              url = `https://${value}`;
            }
          } else {
            url = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
          }
          localStorage.setItem("@lunar/gourl", `/p/${config.encodeUrl(url)}`);
          window.location.href = "./go";
        }
      });
    });

    document.body.appendChild(gameContainerDiv);
  }
});
