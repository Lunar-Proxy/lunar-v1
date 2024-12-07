import { launch2 } from "@src/utils/frame.ts";

type Asset = {
  name: string;
  link: { name: string; url: string }[]; 
  image: string;
  error: boolean | string;
};

const input = document.getElementById("input") as HTMLInputElement;
const button = document.querySelectorAll("[id='data-2']") as NodeListOf<HTMLButtonElement>;

if (input) {
  input.addEventListener("input", () => {
    const term = input.value.toLowerCase();
    button.forEach((button) => {
      const json = button.getAttribute("data-json");
      if (json) {
        try {
          const asset: Asset = JSON.parse(json);
          if (asset.name.toLowerCase().includes(term)) {
            button.classList.remove("hidden");
          } else {
            button.classList.add("hidden")
          }
        } catch (error) {
          console.error("Failed to parse JSON:", error);
        }
      }
    });
  });
}

button.forEach((button) => {
  button.addEventListener("click", async () => {
    const json = button.getAttribute("data-json");
    if (json) {
      try {
        const asset: Asset = JSON.parse(json);
        const launch = document.getElementById("game-frame") as HTMLDivElement;
        launch.classList.remove("hidden");
        
        if (asset.error) {
          alert(asset.error);
        }

        if (Array.isArray(asset.link)) {
          const userChoice = prompt(`Please choose a link by entering a number:\n${asset.link.map((item, index) => `${index + 1}. ${item.name}`).join('\n')}`);

          if (userChoice) {
            const index = parseInt(userChoice) - 1;
            if (index >= 0 && index < asset.link.length) {
              launch2(asset.link[index].url);
            } else {
              alert("Invalid choice. Please try again.");
              return;
            }
          } else {
            alert("No choice made.");
            return;
          }
        } else {
          launch2(asset.link);
        }
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    } else {
      console.warn("Unable to get json data.");
    }
  });
});
