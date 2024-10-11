interface Game {
  name: string;
  logo: string;
  issue: string;
  category: string;
  website: string;
}

async function fetchGames(): Promise<Game[]> {
  try {
    const response: Response = await fetch("./assets/json/games.json");
    if (!response.ok) {
      throw new Error("Unable to find file");
    }
    const gamelist: Game[] = await response.json();
    if (!Array.isArray(gamelist)) {
      throw new Error("Did not return json, returned something else.");
    }
    return gamelist;
  } catch (error: unknown) {
    throw new Error(
      `Failed to fetch list of games: ${error instanceof Error ? error.message : error}`,
    );
  }
}

fetchGames().then((gamelist) => {
  if (gamelist) {
    const gameContainerDiv = document.createElement("div");
    gameContainerDiv.className = "mt-10 flex flex-wrap justify-start";
    gamelist.forEach((element: Game) => {
      const gamediv = document.createElement("div");
      gamediv.className = "w-1/4 m-[0.1px] p-1";
      const gameContainer = document.createElement("div");
      gameContainer.className = "relative inline-block overflow-hidden group";
      const gameImage = document.createElement("img");
      gameImage.src = element.logo;
      gameImage.alt = `${element.name}`;
      gameImage.className =
        "h-32 w-40 object-cover transition duration-300 ease-in-out transform group-hover:blur-sm";
      const gameName = document.createElement("h3");
      gameName.textContent = element.name;
      gameName.className =
        "text-white absolute left-0 bottom-0 transform translate-y-full opacity-0 transition-opacity duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 font-rubik text-lg tracking-wide p-0";
      gameContainer.appendChild(gameImage);
      gameContainer.appendChild(gameName);
      gamediv.appendChild(gameContainer);
      gameContainerDiv.appendChild(gamediv);
      gameContainer.addEventListener("click", function (event) {
        event.preventDefault();
        if (element.issue) {
          alert(element.issue);
        } else {
          let value = element.website?.trim() ?? "";
          let url: string = "";
          let regex =
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
          if (regex.test(value)) {
            url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
          } else {
            url = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
          }
          const encurl = config.encodeUrl(url);
          localStorage.setItem("@lunar/gourl", "/p/" + encurl || "");
          window.location.href = "./g";
        }
      });
    });
    document.body.appendChild(gameContainerDiv);
  }
});
