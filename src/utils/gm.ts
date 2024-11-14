interface Game {
  icon: string;
  website: string;
  name: string;
  error: boolean;
}

const lp = "@lunar/lsg";
const gameContainer = document.getElementById("gameContainer") as HTMLElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const categoryButton = document.getElementById(
  "category-button",
) as HTMLElement;
const categoryMenu = document.getElementById("category-menu") as HTMLElement;

let currentCategory: "all" | "lastPlayed" = "all";

async function loadGames(): Promise<void> {
  try {
    const response = await fetch("./assets/json/g.json");
    const games: Game[] = await response.json();
    renderGames(gameContainer, games);
  } catch (error: unknown) {
    throw new Error(
      ` Unable to load games: ${error instanceof Error ? error.message : error}`,
    );
  }
}

function loadLastPlayed(): void {
  const lastPlayed: Game[] = JSON.parse(localStorage.getItem(lp) || "[]");
  renderGames(gameContainer, lastPlayed);
}

function saveLastPlayed(game: Game): void {
  const lastPlayed: Game[] = JSON.parse(localStorage.getItem(lp) || "[]");
  const existingIndex = lastPlayed.findIndex(
    (item) => item.website === game.website,
  );
  if (existingIndex !== -1) lastPlayed.splice(existingIndex, 1);
  lastPlayed.unshift(game);
  localStorage.setItem(lp, JSON.stringify(lastPlayed.slice(0, 5)));
}

function createGameCard(
  container: HTMLElement,
  { icon, website, name, error }: Game,
): void {
  const gameCard = document.createElement("div");
  gameCard.className =
    "bg-gray-800 border border-gray-600 h-72 w-48 rounded-lg p-3 shadow-lg cursor-pointer transition transform hover:scale-105 game-card flex flex-col justify-between";

  gameCard.onclick = () => {
    if (!error) {
      saveLastPlayed({ icon, website, name, error });
      if (localStorage.getItem("@lunar/settings/transport") == null) {
        localStorage.setItem("@lunar/settings/transport", "lc");
      }
      localStorage.setItem("@lunar/gourl", `${website}`);
      window.location.href = "./browse";
    } else {
      alert("Error: This game is unavailable.");
    }
  };

  const gameIcon = document.createElement("img");
  gameIcon.src = icon;
  gameIcon.alt = name;
  gameIcon.className = "w-full h-40 object-cover rounded-md";

  const gameName = document.createElement("div");
  gameName.className =
    "text-lg text-white font-semibold game-name text-center mt-2";
  gameName.innerText = name;

  gameCard.append(gameIcon, gameName);
  container.appendChild(gameCard);
}

function renderGames(container: HTMLElement, games: Game[]): void {
  container.innerHTML = "";
  games.forEach((game) => createGameCard(container, game));
}

function filterGames(): void {
  const searchTerm = searchInput.value.toLowerCase();
  document.querySelectorAll<HTMLElement>(".game-card").forEach((card) => {
    const gameName = (
      card.querySelector(".game-name") as HTMLElement
    ).innerText.toLowerCase();
    card.style.display = gameName.includes(searchTerm) ? "" : "none";
  });
}

function toggleCategoryMenu(): void {
  categoryMenu.classList.toggle("hidden");
}

function changeCategory(category: "all" | "lastPlayed"): void {
  currentCategory = category;
  categoryMenu.classList.add("hidden");

  if (currentCategory === "lastPlayed") {
    loadLastPlayed();
  } else {
    loadGames();
  }
}

categoryButton.addEventListener("click", toggleCategoryMenu);
categoryMenu.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.tagName === "LI") {
    changeCategory(target.dataset.value as "all" | "lastPlayed");
  }
});

searchInput.addEventListener("input", filterGames);

async function init() {
  await loadGames();
}

init();
