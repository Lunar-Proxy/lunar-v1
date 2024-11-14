interface App {
  icon: string;
  website: string;
  name: string;
  error: boolean;
}

const lp1 = "@lunar/lsa";
const appContainer = document.getElementById("appContainer") as HTMLElement;
const searchInput1 = document.getElementById("searchInput") as HTMLInputElement;
const categoryButton1 = document.getElementById(
  "category-button",
) as HTMLElement;
const categoryMenu1 = document.getElementById("category-menu") as HTMLElement;

let currentCategory1: "all" | "lastPlayed" = "all";

async function loadApps(): Promise<void> {
  try {
    const response = await fetch("/assets/json/a.json");
    const apps: App[] = await response.json();
    renderApps(appContainer, apps);
  } catch (error: unknown) {
    throw new Error(
      `Unable to load apps: ${error instanceof Error ? error.message : error}`,
    );
  }
}

function loadLastPlayed1(): void {
  const lastPlayed: App[] = JSON.parse(localStorage.getItem(lp1) || "[]");
  renderApps(appContainer, lastPlayed);
}

function saveLastPlayed1(app: App): void {
  const lastPlayed: App[] = JSON.parse(localStorage.getItem(lp1) || "[]");
  const existingIndex = lastPlayed.findIndex(
    (item) => item.website === app.website,
  );
  if (existingIndex !== -1) lastPlayed.splice(existingIndex, 1);
  lastPlayed.unshift(app);
  localStorage.setItem(lp1, JSON.stringify(lastPlayed.slice(0, 5)));
}

function createAppCard(
  container: HTMLElement,
  { icon, website, name, error }: App,
): void {
  const appCard = document.createElement("div");
  appCard.className =
    "bg-gray-800 border border-gray-600 h-72 w-48 rounded-lg p-3 shadow-lg cursor-pointer transition transform hover:scale-105 app-card flex flex-col justify-between";

  appCard.onclick = () => {
    if (!error) {
      saveLastPlayed1({ icon, website, name, error });
      if (localStorage.getItem("@lunar/settings/transport") == null) {
        localStorage.setItem("@lunar/settings/transport", "lc");
      }
      localStorage.setItem("@lunar/gourl", `${website}`);
      window.location.href = "./browse";
    } else {
      alert("Error: This app is unavailable.");
    }
  };

  const appIcon = document.createElement("img");
  appIcon.src = icon;
  appIcon.alt = name;
  appIcon.className = "w-full h-40 object-cover rounded-md";

  const appName = document.createElement("div");
  appName.className =
    "text-lg text-white font-semibold app-name text-center mt-2";
  appName.innerText = name;

  appCard.append(appIcon, appName);
  container.appendChild(appCard);
}

function renderApps(container: HTMLElement, apps: App[]): void {
  container.innerHTML = "";
  apps.forEach((app) => createAppCard(container, app));
}

function filterApps(): void {
  const searchTerm = searchInput1.value.toLowerCase();
  document.querySelectorAll<HTMLElement>(".app-card").forEach((card) => {
    const appName = (
      card.querySelector(".app-name") as HTMLElement
    ).innerText.toLowerCase();
    card.style.display = appName.includes(searchTerm) ? "" : "none";
  });
}

function toggleCategoryMenu1(): void {
  categoryMenu1.classList.toggle("hidden");
}

function changeCategory1(category: "all" | "lastPlayed"): void {
  currentCategory1 = category;
  categoryMenu1.classList.add("hidden");

  if (currentCategory1 === "lastPlayed") {
    loadLastPlayed1();
  } else {
    loadApps();
  }
}

categoryButton1.addEventListener("click", toggleCategoryMenu1);
categoryMenu1.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.tagName === "LI") {
    changeCategory1(target.dataset.value as "all" | "lastPlayed");
  }
});

searchInput1.addEventListener("input", filterApps);
window.addEventListener("load", loadApps);
