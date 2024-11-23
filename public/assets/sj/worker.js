(() => {
  "use strict";
  var e = {
      1762: function (e, t, r) {
        r.d(t, {
          Z: function () {
            return s;
          },
        });
        let s = {
          fmt: function (e, t, ...r) {
            let s = Error.prepareStackTrace;
            Error.prepareStackTrace = (e, t) => {
              t.shift(), t.shift(), t.shift();
              let r = "";
              for (let e = 1; e < Math.min(2, t.length); e++)
                t[e].getFunctionName() &&
                  (r += `${t[e].getFunctionName()} -> ` + r);
              return (r += t[0].getFunctionName() || "Anonymous");
            };
            let o = (function () {
              try {
                throw Error();
              } catch (e) {
                return e.stack;
              }
            })();
            Error.prepareStackTrace = s;
            let n = console[e] || console.log;
            n(
              `%c${o}%c ${t}`,
              `
		background-color: ${{ log: "#000", warn: "#f80", error: "#f00", debug: "transparent" }[e]};
		color: ${{ log: "#fff", warn: "#fff", error: "#fff", debug: "gray" }[e]};
		padding: ${{ log: 2, warn: 4, error: 4, debug: 0 }[e]}px;
		font-weight: bold;
		font-family: monospace;
		font-size: 0.9em;
	`,
              `${"debug" === e ? "color: gray" : ""}`,
              ...r,
            );
          },
          log: function (e, ...t) {
            this.fmt("log", e, ...t);
          },
          warn: function (e, ...t) {
            this.fmt("warn", e, ...t);
          },
          error: function (e, ...t) {
            this.fmt("error", e, ...t);
          },
          debug: function (e, ...t) {
            this.fmt("debug", e, ...t);
          },
        };
      },
    },
    t = {};
  function r(s) {
    var o = t[s];
    if (void 0 !== o) return o.exports;
    var n = (t[s] = { exports: {} });
    return e[s](n, n.exports, r), n.exports;
  }
  (r.d = function (e, t) {
    for (var s in t)
      r.o(t, s) &&
        !r.o(e, s) &&
        Object.defineProperty(e, s, { enumerable: !0, get: t[s] });
  }),
    (r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    });
  class s {
    handle;
    origin;
    syncToken;
    promises;
    messageChannel;
    connected;
    constructor(e, t) {
      (this.handle = e),
        (this.origin = t),
        (this.syncToken = 0),
        (this.promises = {}),
        (this.messageChannel = new MessageChannel()),
        (this.connected = !1),
        this.messageChannel.port1.addEventListener("message", (e) => {
          "scramjet$type" in e.data &&
            ("init" === e.data.scramjet$type
              ? (this.connected = !0)
              : this.handleMessage(e.data));
        }),
        this.messageChannel.port1.start(),
        this.handle.postMessage(
          { scramjet$type: "init", scramjet$port: this.messageChannel.port2 },
          [this.messageChannel.port2],
        );
    }
    handleMessage(e) {
      let t = this.promises[e.scramjet$token];
      t && (t(e), delete this.promises[e.scramjet$token]);
    }
    async fetch(e) {
      let t = this.syncToken++,
        r = {
          scramjet$type: "fetch",
          scramjet$token: t,
          scramjet$request: {
            url: e.url,
            body: e.body,
            headers: Array.from(e.headers.entries()),
            method: e.method,
            mode: e.mode,
            destinitation: e.destination,
          },
        },
        s = e.body ? [e.body] : [];
      this.handle.postMessage(r, s);
      let { scramjet$response: o } = await new Promise((e) => {
        this.promises[t] = e;
      });
      return (
        !!o &&
        new Response(o.body, {
          headers: o.headers,
          status: o.status,
          statusText: o.statusText,
        })
      );
    }
  }
  !("$scramjet" in self) &&
    (self.$scramjet = {
      version: { build: "f561029", version: "1.0.2-dev" },
      codec: {},
      flagEnabled: function (e, t) {
        let r = o.config.defaultFlags[e];
        for (let r in o.config.siteFlags) {
          let s = o.config.siteFlags[r];
          if (new RegExp(r).test(t.href) && e in s) return s[e];
        }
        return r;
      },
    });
  let o = self.$scramjet,
    n = Function,
    {
      util: { BareClient: i, ScramjetHeaders: a, BareMuxConnection: c },
      url: { rewriteUrl: l, unrewriteUrl: d, rewriteBlob: h, unrewriteBlob: u },
      rewrite: {
        rewriteCss: f,
        unrewriteCss: m,
        rewriteHtml: p,
        unrewriteHtml: g,
        rewriteSrcset: y,
        rewriteJs: b,
        rewriteHeaders: w,
        rewriteWorkers: v,
        htmlRules: k,
      },
      CookieStore: x,
    } = o.shared;
  function R(e) {
    return { origin: e, base: e };
  }
  async function S(e, t) {
    let r = new URLSearchParams(new URL(e.url).search);
    if (r.has("url"))
      return Response.redirect(l(r.get("url"), R(new URL(r.get("url")))));
    try {
      let s = new URL(e.url),
        n = "";
      if (
        (s.searchParams.has("type") &&
          ((n = s.searchParams.get("type")), s.searchParams.delete("type")),
        s.searchParams.has("dest") && s.searchParams.delete("dest"),
        s.pathname.startsWith(this.config.prefix + "blob:") ||
          s.pathname.startsWith(this.config.prefix + "data:"))
      ) {
        let r,
          o = s.pathname.substring(this.config.prefix.length);
        o.startsWith("blob:") && (o = u(o));
        let i = await fetch(o, {});
        i.body &&
          (r = await j(
            i,
            t
              ? {
                  base: new URL(new URL(t.url).origin),
                  origin: new URL(new URL(t.url).origin),
                }
              : R(new URL(d(e.referrer))),
            e.destination,
            n,
            this.cookieStore,
          ));
        let a = Object.fromEntries(i.headers.entries());
        return (
          crossOriginIsolated &&
            ((a["Cross-Origin-Opener-Policy"] = "same-origin"),
            (a["Cross-Origin-Embedder-Policy"] = "require-corp")),
          new Response(r, {
            status: i.status,
            statusText: i.statusText,
            headers: a,
          })
        );
      }
      let i = new URL(d(s)),
        c = this.serviceWorkers.find((e) => e.origin === i.origin);
      if (c && c.connected && "swruntime" !== r.get("from")) {
        let t = await c.fetch(e);
        if (t) return t;
      }
      if (i.origin == new URL(e.url).origin)
        throw Error(
          "attempted to fetch from same origin - this means the site has obtained a reference to the real origin, aborting",
        );
      let l = new a();
      for (let [t, r] of e.headers.entries()) l.set(t, r);
      if (t && new URL(t.url).pathname.startsWith(o.config.prefix)) {
        let e = new URL(d(t.url));
        e.toString().includes("youtube.com") ||
          (l.set("Referer", e.toString()), l.set("Origin", e.origin));
      }
      let h = this.cookieStore.getCookies(i, !1);
      h.length && l.set("Cookie", h),
        l.set("Sec-Fetch-Dest", e.destination),
        l.set("Sec-Fetch-Mode", "cors" === e.mode ? e.mode : "same-origin");
      let f = new E(i, e.body, e.method, e.destination, t, l.headers);
      this.dispatchEvent(f);
      let m =
        f.response ||
        (await this.client.fetch(f.url, {
          method: f.method,
          body: f.body,
          headers: f.requestHeaders,
          credentials: "omit",
          mode: "cors" === e.mode ? e.mode : "same-origin",
          cache: e.cache,
          redirect: "manual",
          duplex: "half",
        }));
      return await $(i, n, e.destination, m, this.cookieStore, t, this);
    } catch (t) {
      if (
        (console.error("ERROR FROM SERVICE WORKER FETCH", t),
        !["document", "iframe"].includes(e.destination))
      )
        return new Response(void 0, { status: 500 });
      return (function (e, t) {
        let r = { "content-type": "text/html" };
        return (
          crossOriginIsolated &&
            (r["Cross-Origin-Embedder-Policy"] = "require-corp"),
          new Response(
            (function (e, t) {
              let r = `
                errorTrace.value = ${JSON.stringify(e)};
                fetchedURL.textContent = ${JSON.stringify(t)};
                for (const node of document.querySelectorAll("#hostname")) node.textContent = ${JSON.stringify(location.hostname)};
                reload.addEventListener("click", () => location.reload());
                version.textContent = ${JSON.stringify(o.version.version)};
                build.textContent = ${JSON.stringify(o.version.build)};
        `;
              return `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Scramjet</title>
                    <style>
                    :root {
                        --deep: #080602;
                        --shallow: #181412;
                        --beach: #f1e8e1;
                        --shore: #b1a8a1;
                        --accent: #ffa938;
                        --font-sans: -apple-system, system-ui, BlinkMacSystemFont, sans-serif;
                        --font-monospace: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    }

                    *:not(div,p,span,ul,li,i,span) {
                        background-color: var(--deep);
                        color: var(--beach);
                        font-family: var(--font-sans);
                    }

                    textarea,
                    button {
                        background-color: var(--shallow);
                        border-radius: 0.6em;
                        padding: 0.6em;
                        border: none;
                        appearance: none;
                        font-family: var(--font-sans);
                        color: var(--beach);
                    }

                    button.primary {
                        background-color: var(--accent);
                        color: var(--deep);
                        font-weight: bold;
                    }

                    textarea {
                        resize: none;
                        height: 20em;
                        text-align: left;
                        font-family: var(--font-monospace);
                    }

                    body {
                        width: 100vw;
                        height: 100vh;
                        justify-content: center;
                        align-items: center;
                    }

                    body,
                    html,
                    #inner {
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        gap: 0.5em;
                        overflow: hidden;
                    }

                    #inner {
                        z-index: 100;
                    }

                    #cover {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background-color: color-mix(in srgb, var(--deep) 70%, transparent);
                        z-index: 99;
                    }

                    #info {
                        display: flex;
                        flex-direction: row;
                        align-items: flex-start;
                        gap: 1em;
                    }

                    #version-wrapper {
                        width: 100%;
                        text-align: center;
                        position: absolute;
                        bottom: 0.2rem;
                        font-size: 0.8rem;
                        color: var(--shore)!important;
                        i {
                            background-color: color-mix(in srgb, var(--deep), transparent 50%);
                            border-radius: 9999px;
                            padding: 0.2em 0.5em;
                        }
                        z-index: 101;
                    }
                    </style>
                </head>
                <body>
                    <div id="cover"></div>
                    <div id="inner">
                        <h1 id="errorTitle">Uh oh!</h1>
                        <p>There was an error loading <b id="fetchedURL"></b></p>
                        <!-- <p id="errorMessage">Internal Server Error</p> -->

                        <div id="info">
                            <textarea id="errorTrace" cols="40" rows="10" readonly>
                            </textarea>
                            <div id="troubleshooting">
                                <p>Try:</p>
                                <ul>
                                    <li>Checking your internet connection</li>
                                    <li>Verifying you entered the correct address</li>
                                    <li>Clearing the site data</li>
                                    <li>Contacting <b id="hostname"></b>'s administrator</li>
                                    <li>Verify the server isn't censored</li>
                                </ul>
                                <p>If you're the administrator of <b id="hostname"></b>, try:</p>
                                    <ul>
                                    <li>Restarting your server</li>
                                    <li>Updating Scramjet</li>
                                    <li>Troubleshooting the error on the <a href="https://github.com/MercuryWorkshop/scramjet" target="_blank">GitHub repository</a></li>
                                </ul>
                            </div>
                        </div>
                        <br>
                        <button id="reload" class="primary">Reload</button>
                    </div>
                    <p id="version-wrapper"><i>Scramjet v<span id="version"></span> (build <span id="build"></span>)</i></p>
                    <script src="${"data:application/javascript," + encodeURIComponent(r)}"></script>
                </body>
            </html>
        `;
            })(String(e), t),
            { status: 500, headers: r },
          )
        );
      })(t, d(e.url));
    }
  }
  async function $(e, t, r, s, o, n, i) {
    let a;
    let c = w(s.rawHeaders, R(e)),
      l = c["set-cookie"] || [];
    for (let t in l)
      n && n.postMessage({ scramjet$type: "cookie", cookie: t, url: e.href });
    for (let t in (await o.setCookies(l instanceof Array ? l : [l], e), c))
      Array.isArray(c[t]) && (c[t] = c[t][0]);
    if (
      (s.body && (a = await j(s, R(e), r, t, o)),
      ["document", "iframe"].includes(r))
    ) {
      let e = c["content-disposition"];
      if (!/\s*?((inline|attachment);\s*?)filename=/i.test(e)) {
        let t = /^\s*?attachment/i.test(e) ? "attachment" : "inline",
          [r] = new URL(s.finalURL).pathname.split("/").slice(-1);
        c["content-disposition"] = `${t}; filename=${JSON.stringify(r)}`;
      }
    }
    "text/event-stream" === c.accept &&
      (c["content-type"] = "text/event-stream"),
      delete c["permissions-policy"],
      crossOriginIsolated &&
        [
          "document",
          "iframe",
          "worker",
          "sharedworker",
          "style",
          "script",
        ].includes(r) &&
        ((c["Cross-Origin-Embedder-Policy"] = "require-corp"),
        (c["Cross-Origin-Opener-Policy"] = "same-origin"));
    let d = new C(a, c, s.status, s.statusText, r, e, s, n);
    return (
      i.dispatchEvent(d),
      new Response(d.responseBody, {
        headers: d.responseHeaders,
        status: d.status,
        statusText: d.statusText,
      })
    );
  }
  async function j(e, t, r, s, o) {
    switch (r) {
      case "iframe":
      case "document":
        if (e.headers.get("content-type")?.startsWith("text/html"))
          return p(await e.text(), o, t, !0);
        return e.body;
      case "script":
        return b(await e.arrayBuffer(), e.finalURL, t);
      case "style":
        return f(await e.text(), t);
      case "sharedworker":
      case "worker":
        return v(await e.arrayBuffer(), s, e.url, t);
      default:
        return e.body;
    }
  }
  o.config;
  class C extends Event {
    responseBody;
    responseHeaders;
    status;
    statusText;
    destination;
    url;
    rawResponse;
    client;
    constructor(e, t, r, s, o, n, i, a) {
      super("handleResponse"),
        (this.responseBody = e),
        (this.responseHeaders = t),
        (this.status = r),
        (this.statusText = s),
        (this.destination = o),
        (this.url = n),
        (this.rawResponse = i),
        (this.client = a);
    }
  }
  class E extends Event {
    url;
    body;
    method;
    destination;
    client;
    requestHeaders;
    constructor(e, t, r, s, o, n) {
      super("request"),
        (this.url = e),
        (this.body = t),
        (this.method = r),
        (this.destination = s),
        (this.client = o),
        (this.requestHeaders = n);
    }
    response;
  }
  var O = r(1762).Z;
  class L extends EventTarget {
    client;
    config;
    syncPool = {};
    synctoken = 0;
    cookieStore = new o.shared.CookieStore();
    serviceWorkers = [];
    constructor() {
      super(), (this.client = new o.shared.util.BareClient());
      let e = indexedDB.open("$scramjet", 1);
      (e.onsuccess = () => {
        let t = e.result
          .transaction("cookies", "readonly")
          .objectStore("cookies")
          .get("cookies");
        t.onsuccess = () => {
          t.result &&
            (this.cookieStore.load(t.result),
            O.log("Loaded cookies from IDB!"));
        };
      }),
        addEventListener("message", async ({ data: t }) => {
          if ("scramjet$type" in t) {
            if ("registerServiceWorker" === t.scramjet$type) {
              this.serviceWorkers.push(new s(t.port, t.origin));
              return;
            }
            "cookie" === t.scramjet$type &&
              (this.cookieStore.setCookies([t.cookie], new URL(t.url)),
              e.result
                .transaction("cookies", "readwrite")
                .objectStore("cookies")
                .put(JSON.parse(this.cookieStore.dump()), "cookies"));
          }
        });
    }
    async loadConfig() {
      if (this.config) return;
      let e = indexedDB.open("$scramjet", 1);
      return new Promise((t, r) => {
        (e.onsuccess = async () => {
          let s = e.result
            .transaction("config", "readonly")
            .objectStore("config")
            .get("config");
          (s.onsuccess = () => {
            (this.config = s.result),
              (o.config = s.result),
              (o.codec.encode = n("url", o.config.codec.encode)),
              (o.codec.decode = n("url", o.config.codec.decode)),
              t();
          }),
            (s.onerror = () => r(s.error));
        }),
          (e.onerror = () => r(e.error));
      });
    }
    route({ request: e }) {
      return !!e.url.startsWith(location.origin + this.config.prefix) || !1;
    }
    async fetch({ request: e, clientId: t }) {
      let r = await self.clients.get(t);
      return S.call(this, e, r);
    }
  }
  self.ScramjetServiceWorker = L;
})();
//# sourceMappingURL=scramjet.worker.js.map
