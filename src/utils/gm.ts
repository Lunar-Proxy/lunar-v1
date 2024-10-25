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
      `Failed to fetch list of games: ${error instanceof Error ? error.message : error}`
    );
  }
}

fetchGames().then((gamelist) => {
  if (gamelist) {
    const gameContainerDiv = document.getElementById("game-container")!;
    const lastPlayedGames: Game[] = JSON.parse(localStorage.getItem("@lunar/lp") || "[]");
    const categoryLabel = document.getElementById("category-label")!;

    const renderGames = (filteredList: Game[], container: HTMLElement) => {
      container.innerHTML = '';
      filteredList.forEach((element: Game) => {
        const gamediv = document.createElement("div");
        gamediv.className = "game-item w-56 h-56 transition-transform duration-300 transform hover:scale-105 m-2";
        gamediv.setAttribute("data-name", element.name.toLowerCase());

        const gameContainer = document.createElement("div");
        gameContainer.className = "relative flex items-center justify-center overflow-hidden rounded-lg shadow-lg bg-gray-800 group hover:shadow-xl transition-shadow duration-300 h-full";

        const gameImage = document.createElement("img");
        gameImage.src = element.logo;
        gameImage.alt = `${element.name}`;
        gameImage.className = "h-full w-full object-contain transition duration-300 ease-in-out transform group-hover:blur-sm";

        const gameName = document.createElement("h3");
        gameName.textContent = element.name;
        gameName.className = "text-white absolute bottom-0 left-0 right-0 text-center transform translate-y-full opacity-0 transition-opacity duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 font-rubik text-lg tracking-wide p-2 bg-gradient-to-t from-gray-800 to-transparent";

        gameContainer.appendChild(gameImage);
        gameContainer.appendChild(gameName);
        gamediv.appendChild(gameContainer);
        container.appendChild(gamediv);

        gameContainer.addEventListener("click", function (event) {
          event.preventDefault();
          lastPlayedGames.unshift(element);
          localStorage.setItem("@lunar/lp", JSON.stringify(lastPlayedGames.slice(0, 5)));
          let value = element.website?.trim() ?? "";
          let url: string = "";
          let regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
          if (regex.test(value)) {
            url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
          } else {
            url = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
          }
          const encurl = config.encodeUrl(url);
          localStorage.setItem("@lunar/gourl", "/us/" + encurl || "");
          if (localStorage.getItem("@lunar/settings/transport") == null) {
            localStorage.setItem("@lunar/settings/transport", "lc");
          }
          window.location.href = "./g";
        });
      });
    };

    renderGames(gamelist, gameContainerDiv);

    const searchInput = document.getElementById("search-input") as HTMLInputElement;
    const categoryButton = document.getElementById("category-button")!;
    const categoryMenu = document.getElementById("category-menu")!;

    const filterGames = (selectedCategory: string) => {
      const searchTerm = searchInput.value.toLowerCase();

      let filteredList: Game[] = [];
      if (selectedCategory === "lastPlayed") {
        filteredList = lastPlayedGames;
      } else {
        filteredList = gamelist;
      }

      filteredList = filteredList.filter((game) => game.name.toLowerCase().includes(searchTerm));
      renderGames(filteredList, gameContainerDiv);
    };

    searchInput.addEventListener("input", () => filterGames(""));

    categoryButton.addEventListener("click", () => {
      categoryMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (!categoryButton.contains(target) && !categoryMenu.contains(target)) {
        categoryMenu.classList.add("hidden");
      }
    });

    categoryMenu.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "LI") {
        const selectedCategory = target.getAttribute("data-value")!;
        categoryLabel.textContent = selectedCategory === "lastPlayed" ? "Last Played" : "All Categories";
        filterGames(selectedCategory);
        categoryMenu.classList.add("hidden");
      }
    });
  }
});
