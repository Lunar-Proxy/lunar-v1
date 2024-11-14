const setup = {
  wisp:
    localStorage.getItem("@lunar/settings/wisp") ||
    (location.protocol === "https:" ? "wss" : "ws") +
      "://" +
      location.host +
      "/goo/",
  transport: localStorage.getItem("@lunar/settings/transport") || "lc",
  proxy: localStorage.getItem("@lunar/settings/ptype") || "uv",
  gourl: localStorage.getItem("@lunar/gourl") || "https://www.google.com",
  engine:
    localStorage.getItem("@lunar/settings/engine") ||
    "https://www.google.com/search?q=",
};

export default setup;
