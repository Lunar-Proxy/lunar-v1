const config = {
  prefix: "/p/",
  encodeUrl: (str) => {
    if (!str) return str;
    let result = "";
    for (let i = 0; i < str.length; i++) {
      result += i % 2 ? String.fromCharCode(str.charCodeAt(i) ^ 2) : str[i];
    }
    return encodeURIComponent(result);
  },
  decodeUrl: (str) => {
    if (!str) return str;
    const [input, ...search] = str.split("?");
    let result = "";
    const decoded = decodeURIComponent(input);
    for (let i = 0; i < decoded.length; i++) {
      result +=
        i % 2 ? String.fromCharCode(decoded.charCodeAt(i) ^ 2) : decoded[i];
    }
    return result + (search.length ? "?" + search.join("?") : "");
  },
  handler: "/u/handler.js",
  client: "/u/client.js",
  bundle: "/u/bundle.js",
  config: "/u/config.js",
  sw: "/u/sw.js",
};
self.__uv$config = config;
