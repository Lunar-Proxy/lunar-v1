(()=>{"use strict";let e;class t{handle;origin;syncToken;promises;messageChannel;connected;constructor(e,t){this.handle=e,this.origin=t,this.syncToken=0,this.promises={},this.messageChannel=new MessageChannel,this.connected=!1,this.messageChannel.port1.addEventListener("message",e=>{"scramjet$type"in e.data&&("init"===e.data.scramjet$type?this.connected=!0:this.handleMessage(e.data))}),this.messageChannel.port1.start(),this.handle.postMessage({scramjet$type:"init",scramjet$port:this.messageChannel.port2},[this.messageChannel.port2])}handleMessage(e){let t=this.promises[e.scramjet$token];t&&(t(e),delete this.promises[e.scramjet$token])}async fetch(e){let t=this.syncToken++,n={scramjet$type:"fetch",scramjet$token:t,scramjet$request:{url:e.url,body:e.body,headers:Array.from(e.headers.entries()),method:e.method,mode:e.mode,destinitation:e.destination}},r=e.body?[e.body]:[];this.handle.postMessage(n,r);let{scramjet$response:o}=await new Promise(e=>{this.promises[t]=e});return!!o&&new Response(o.body,{headers:o.headers,status:o.status,statusText:o.statusText})}}"$scramjet"in self||(self.$scramjet={version:{build:"fc948fa",version:"1.0.2-dev"},codec:{},flagEnabled:o});let n=self.$scramjet,r=Function;function o(e,t){let r=n.config.flags[e];for(let r in n.config.siteFlags){let o=n.config.siteFlags[r];if(new RegExp(r).test(t.href)&&e in o)return o[e]}return r}let{util:{BareClient:i,ScramjetHeaders:s,BareMuxConnection:a},url:{rewriteUrl:c,unrewriteUrl:l,rewriteBlob:d,unrewriteBlob:u},rewrite:{rewriteCss:f,unrewriteCss:g,rewriteHtml:b,unrewriteHtml:h,rewriteSrcset:m,rewriteJs:w,rewriteHeaders:p,rewriteWorkers:_,htmlRules:y},CookieStore:v}=n.shared;function x(t){let n=e.__externref_table_alloc();return e.__wbindgen_export_2.set(n,t),n}function k(t,n){try{return t.apply(this,n)}catch(n){let t=x(n);e.__wbindgen_exn_store(t)}}n.config;let S="undefined"!=typeof TextDecoder?new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};"undefined"!=typeof TextDecoder&&S.decode();let R=null;function j(){return(null===R||R.buffer!==e.memory.buffer)&&(R=new Uint8Array(e.memory.buffer)),R}function $(e,t){return e>>>=0,S.decode(j().slice(e,e+t))}let T=0,C="undefined"!=typeof TextEncoder?new TextEncoder("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}},A=function(e,t){let n=C.encode(e);return t.set(n),{read:e.length,written:n.length}};function L(e,t,n){if(void 0===n){let n=C.encode(e),r=t(n.length,1)>>>0;return j().subarray(r,r+n.length).set(n),T=n.length,r}let r=e.length,o=t(r,1)>>>0,i=j(),s=0;for(;s<r;s++){let t=e.charCodeAt(s);if(t>127)break;i[o+s]=t}if(s!==r){0!==s&&(e=e.slice(s)),o=n(o,r,r=s+3*e.length,1)>>>0;let t=A(e,j().subarray(o+s,o+r));s+=t.written,o=n(o,r,s,1)>>>0}return T=s,o}let E=null;function O(){return(null===E||E.buffer!==e.memory.buffer)&&(E=new DataView(e.memory.buffer)),E}function W(e){return null==e}function U(t){let n=e.__wbindgen_export_2.get(t);return e.__externref_table_dealloc(t),n}async function M(e,t){if("function"==typeof Response&&e instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if("application/wasm"!=e.headers.get("Content-Type"))console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",t);else throw t}let n=await e.arrayBuffer();return await WebAssembly.instantiate(n,t)}{let n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}}function I(){let t={};return t.wbg={},t.wbg.__wbg_call_672a4d21634d4a24=function(){return k(function(e,t){return e.call(t)},arguments)},t.wbg.__wbg_call_7cccdd69e0791ae2=function(){return k(function(e,t,n){return e.call(t,n)},arguments)},t.wbg.__wbg_call_833bed5770ea2041=function(){return k(function(e,t,n,r){return e.call(t,n,r)},arguments)},t.wbg.__wbg_get_67b2ba62fc30de12=function(){return k(function(e,t){return Reflect.get(e,t)},arguments)},t.wbg.__wbg_new_405e22f390576ce2=function(){return{}},t.wbg.__wbg_new_78feb108b6472713=function(){return[]},t.wbg.__wbg_new_9ffbe0a71eff35e3=function(){return k(function(e,t){return new URL($(e,t))},arguments)},t.wbg.__wbg_newnoargs_105ed471475aaf50=function(e,t){return Function($(e,t))},t.wbg.__wbg_newwithbase_161c299e7a34e2eb=function(){return k(function(e,t,n,r){return new URL($(e,t),$(n,r))},arguments)},t.wbg.__wbg_now_d18023d54d4e5500=function(e){return e.now()},t.wbg.__wbg_scramtag_bd98edaa0eaec45e=function(t){let n=L("10000000000".replace(/[018]/g,e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16)),e.__wbindgen_malloc,e.__wbindgen_realloc),r=T;O().setInt32(t+4,r,!0),O().setInt32(t+0,n,!0)},t.wbg.__wbg_set_bb8cecf6a62b9f46=function(){return k(function(e,t,n){return Reflect.set(e,t,n)},arguments)},t.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07=function(){let e="undefined"==typeof global?null:global;return W(e)?0:x(e)},t.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0=function(){let e="undefined"==typeof globalThis?null:globalThis;return W(e)?0:x(e)},t.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819=function(){let e="undefined"==typeof self?null:self;return W(e)?0:x(e)},t.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40=function(){let e="undefined"==typeof window?null:window;return W(e)?0:x(e)},t.wbg.__wbg_toString_5285597960676b7b=function(e){return e.toString()},t.wbg.__wbg_toString_c813bbd34d063839=function(e){return e.toString()},t.wbg.__wbindgen_boolean_get=function(e){return"boolean"==typeof e?+!!e:2},t.wbg.__wbindgen_error_new=function(e,t){return Error($(e,t))},t.wbg.__wbindgen_init_externref_table=function(){let t=e.__wbindgen_export_2,n=t.grow(4);t.set(0,void 0),t.set(n+0,void 0),t.set(n+1,null),t.set(n+2,!0),t.set(n+3,!1)},t.wbg.__wbindgen_is_function=function(e){return"function"==typeof e},t.wbg.__wbindgen_is_undefined=function(e){return void 0===e},t.wbg.__wbindgen_number_new=function(e){return e},t.wbg.__wbindgen_string_get=function(t,n){let r="string"==typeof n?n:void 0;var o=W(r)?0:L(r,e.__wbindgen_malloc,e.__wbindgen_realloc),i=T;O().setInt32(t+4,i,!0),O().setInt32(t+0,o,!0)},t.wbg.__wbindgen_string_new=function(e,t){return $(e,t)},t.wbg.__wbindgen_throw=function(e,t){throw Error($(e,t))},t.wbg.__wbindgen_uint8_array_new=function(t,n){var r,o=(r=t>>>0,j().subarray(r/1,r/1+n)).slice();return e.__wbindgen_free(t,+n,1),o},t}function P(e,t){e.wbg.memory=t||new WebAssembly.Memory({initial:18,maximum:16384,shared:!0})}function B(t,n,r){if(e=t.exports,D.__wbindgen_wasm_module=n,E=null,R=null,void 0!==r&&("number"!=typeof r||0===r||r%65536!=0))throw"invalid stack size";return e.__wbindgen_start(r),e}async function D(t,n){let r;if(void 0!==e)return e;void 0!==t&&(Object.getPrototypeOf(t)===Object.prototype?{module_or_path:t,memory:n,thread_stack_size:r}=t:console.warn("using deprecated parameters for the initialization function; pass a single object instead")),void 0===t&&(t=new URL("wasm_bg.wasm",""));let o=I();("string"==typeof t||"function"==typeof Request&&t instanceof Request||"function"==typeof URL&&t instanceof URL)&&(t=fetch(t)),P(o,n);let{instance:i,module:s}=await M(await t,o);return B(i,s,r)}async function F(){let e=await fetch(n.config.files.wasm).then(e=>e.arrayBuffer());self.REAL_WASM=new Uint8Array(e)}self.WASM&&(self.REAL_WASM=Uint8Array.from(atob(self.WASM),e=>e.charCodeAt(0))),Error.stackTraceLimit=50;let q=new TextDecoder;function N(e){return{origin:e,base:e}}async function H(e,t){try{let r=new URL(e.url),o="";if(r.searchParams.has("type")&&(o=r.searchParams.get("type"),r.searchParams.delete("type")),r.searchParams.has("dest")&&r.searchParams.delete("dest"),r.pathname===this.config.files.wasm)return fetch(this.config.files.wasm).then(async e=>{let t=await e.arrayBuffer(),n=btoa(new Uint8Array(t).reduce((e,t)=>(e.push(String.fromCharCode(t)),e),[]).join("")),r="";return r+=`if ('document' in self && document.currentScript) { document.currentScript.remove(); }
self.WASM = '${n}';`,new Response(r,{headers:{"content-type":"text/javascript"}})});if(r.pathname.startsWith(this.config.prefix+"blob:")||r.pathname.startsWith(this.config.prefix+"data:")){let n,i=r.pathname.substring(this.config.prefix.length);i.startsWith("blob:")&&(i=u(i));let s=await fetch(i,{}),a=i.startsWith("blob:")?i:"(data url)";s.finalURL=a,s.body&&(n=await J(s,t?{base:new URL(new URL(t.url).origin),origin:new URL(new URL(t.url).origin)}:N(new URL(l(e.referrer))),e.destination,o,this.cookieStore));let c=Object.fromEntries(s.headers.entries());return crossOriginIsolated&&(c["Cross-Origin-Opener-Policy"]="same-origin",c["Cross-Origin-Embedder-Policy"]="require-corp"),new Response(n,{status:s.status,statusText:s.statusText,headers:c})}let i=new URL(l(r)),a=this.serviceWorkers.find(e=>e.origin===i.origin);if(a&&a.connected&&"swruntime"!==r.searchParams.get("from")){let t=await a.fetch(e);if(t)return t}if(i.origin==new URL(e.url).origin)throw Error("attempted to fetch from same origin - this means the site has obtained a reference to the real origin, aborting");let c=new s;for(let[t,n]of e.headers.entries())c.set(t,n);if(t&&new URL(t.url).pathname.startsWith(n.config.prefix)){let e=new URL(l(t.url));e.toString().includes("youtube.com")||(c.set("Referer",e.toString()),c.set("Origin",e.origin?`${e.protocol}//${e.host}`:"null"))}let d=this.cookieStore.getCookies(i,!1);d.length&&c.set("Cookie",d),c.set("Sec-Fetch-Dest",e.destination),c.set("Sec-Fetch-Site","same-origin"),c.set("Sec-Fetch-Mode","cors"===e.mode?e.mode:"same-origin");let f=new G(i,c.headers,e.body,e.method,e.destination,t);this.dispatchEvent(f);let g=f.response||await this.client.fetch(f.url,{method:f.method,body:f.body,headers:f.requestHeaders,credentials:"omit",mode:"cors"===e.mode?e.mode:"same-origin",cache:e.cache,redirect:"manual",duplex:"half"});return await z(i,o,e.destination,g,this.cookieStore,t,this)}catch(r){let t={message:r.message,url:e.url,destination:e.destination,timestamp:new Date().toISOString()};if(r.stack&&(t.stack=r.stack),console.error("ERROR FROM SERVICE WORKER FETCH: ",t),!["document","iframe"].includes(e.destination))return new Response(void 0,{status:500});return function(e,t){let r={"content-type":"text/html"};return crossOriginIsolated&&(r["Cross-Origin-Embedder-Policy"]="require-corp"),new Response(function(e,t){let r=`
                errorTrace.value = ${JSON.stringify(e)};
                fetchedURL.textContent = ${JSON.stringify(t)};
                for (const node of document.querySelectorAll("#hostname")) node.textContent = ${JSON.stringify(location.hostname)};
                reload.addEventListener("click", () => location.reload());
                version.textContent = ${JSON.stringify(n.version.version)};
                build.textContent = ${JSON.stringify(n.version.build)};
                
                document.getElementById('copy-button').addEventListener('click', async () => {
                    const text = document.getElementById('errorTrace').value;
                    await navigator.clipboard.writeText(text);
                    const btn = document.getElementById('copy-button');
                    btn.textContent = 'Copied!';
                    setTimeout(() => btn.textContent = 'Copy', 2000);
                });
        `;return`<!DOCTYPE html>
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
                        width: auto;
                        text-align: right;
                        position: absolute;
                        top: 0.5rem;
                        right: 0.5rem;
                        font-size: 0.8rem;
                        color: var(--shore)!important;
                        i {
                            background-color: color-mix(in srgb, var(--deep), transparent 50%);
                            border-radius: 9999px;
                            padding: 0.2em 0.5em;
                        }
                        z-index: 101;
                    }

                    #errorTrace-wrapper {
                        position: relative;
                        width: fit-content;
                    }

                    #copy-button {
                        position: absolute;
                        top: 0.5em;
                        right: 0.5em;
                        padding: 0.23em;
                        cursor: pointer;
                        opacity: 0;
                        transition: opacity 0.4s;
                        font-size: 0.9em;
                    }

                    #errorTrace-wrapper:hover #copy-button {
                        opacity: 1;
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
                            <div id="errorTrace-wrapper">
                                <textarea id="errorTrace" cols="40" rows="10" readonly></textarea>
                                <button id="copy-button" class="primary">Copy</button>
                            </div>
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
                    <script src="${"data:application/javascript,"+encodeURIComponent(r)}"></script>
                </body>
            </html>
        `}(String(e),t),{status:500,headers:r})}(Object.entries(t).map(([e,t])=>`${e.charAt(0).toUpperCase()+e.slice(1)}: ${t}`).join("\n\n"),l(e.url))}}async function z(e,t,n,r,o,i,s){let a;let c=p(r.rawHeaders,N(e)),l=c["set-cookie"]||[];for(let t in l)if(i){let r=s.dispatch(i,{scramjet$type:"cookie",cookie:t,url:e.href});"document"!=n&&"iframe"!=n&&await r}for(let t in await o.setCookies(l instanceof Array?l:[l],e),c)Array.isArray(c[t])&&(c[t]=c[t][0]);if(r.body&&(a=await J(r,N(e),n,t,o)),["document","iframe"].includes(n)){let e=c["content-disposition"];if(!/\s*?((inline|attachment);\s*?)filename=/i.test(e)){let t=/^\s*?attachment/i.test(e)?"attachment":"inline",[n]=new URL(r.finalURL).pathname.split("/").slice(-1);c["content-disposition"]=`${t}; filename=${JSON.stringify(n)}`}}"text/event-stream"===c.accept&&(c["content-type"]="text/event-stream"),delete c["permissions-policy"],crossOriginIsolated&&["document","iframe","worker","sharedworker","style","script"].includes(n)&&(c["Cross-Origin-Embedder-Policy"]="require-corp",c["Cross-Origin-Opener-Policy"]="same-origin");let d=new V(a,c,r.status,r.statusText,n,e,r,i);return s.dispatchEvent(d),new Response(d.responseBody,{headers:d.responseHeaders,status:d.status,statusText:d.statusText})}async function J(t,r,i,s,a){switch(i){case"iframe":case"document":if(t.headers.get("content-type")?.startsWith("text/html"))return b(await t.text(),a,r,!0);return t.body;case"script":let{js:c,tag:l,map:d}=function(t,r,i,s=!1){return function(t,r,i,s=!1){var a;return o("naiiveRewriter",i.origin)?{js:("string"!=typeof(a="string"==typeof t?t:new TextDecoder().decode(t))&&(a=new TextDecoder().decode(a)),`
		with (${n.config.globals.wrapfn}(globalThis)) {

			${a}

		}
	`),tag:"",map:null}:function(t,r,i,s){let a;!function(t,n){let r;if(void 0!==e)return;void 0!==t&&(Object.getPrototypeOf(t)===Object.prototype?{module:t,memory:n,thread_stack_size:r}=t:console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));let o=I();P(o,n),t instanceof WebAssembly.Module||(t=new WebAssembly.Module(t)),B(new WebAssembly.Instance(t,o),t,r)}({module:new WebAssembly.Module(self.REAL_WASM)});let c=performance.now();try{a="string"==typeof t?function(t,n,r,o,i){let s=L(t,e.__wbindgen_malloc,e.__wbindgen_realloc),a=T,c=L(n,e.__wbindgen_malloc,e.__wbindgen_realloc),l=T,d=L(o,e.__wbindgen_malloc,e.__wbindgen_realloc),u=T,f=e.rewrite_js(s,a,c,l,r,d,u,i);if(f[2])throw U(f[1]);return U(f[0])}(t,i.base.href,s,r||"(unknown)",n):function(t,n,r,o,i){let s=function(e,t){let n=t(+e.length,1)>>>0;return j().set(e,n/1),T=e.length,n}(t,e.__wbindgen_malloc),a=T,c=L(n,e.__wbindgen_malloc,e.__wbindgen_realloc),l=T,d=L(o,e.__wbindgen_malloc,e.__wbindgen_realloc),u=T,f=e.rewrite_js_from_arraybuffer(s,a,c,l,r,d,u,i);if(f[2])throw U(f[1]);return U(f[0])}(new Uint8Array(t),i.base.href,s,r||"(unknown)",n)}catch(e){return console.warn("failed rewriting js for",r,e,t),e.message=`failed rewriting js for "${r}": ${e.message}`,{js:t,tag:"",map:null}}let l=performance.now(),{js:d,map:u,scramtag:f,errors:g,duration:b}=a;if(o("sourcemaps",i.base),globalThis.clients||(globalThis[globalThis.$scramjet.config.globals.pushsourcemapfn](Array.from(u),f),u=null),o("rewriterLogs",i.base))for(let e of g)console.error("oxc parse error",e);if(o("rewriterLogs",i.base)){let e;e=b<1n?"BLAZINGLY FAST":b<500n?"decent speed":"really slow";let t=(l-c-Number(b)).toFixed(2);console.log(`oxc rewrite for "${r||"(unknown)"}" was ${e} (${b}ms; ${t}ms overhead)`)}return{js:"string"==typeof t?q.decode(d):d,tag:f,map:u}}(t,r,i,s)}(t,r,i,s)}(await t.arrayBuffer(),t.finalURL,r,"module"===s);return o("sourcemaps",r.base)&&d&&(console.log(c),c=`${globalThis.$scramjet.config.globals.pushsourcemapfn}([${d.join(",")}], "${l}");`+(c instanceof Uint8Array?new TextDecoder().decode(c):c)),c;case"style":return f(await t.text(),r);case"sharedworker":case"worker":return _(await t.arrayBuffer(),s,t.finalURL,r);default:return t.body}}class V extends Event{responseBody;responseHeaders;status;statusText;destination;url;rawResponse;client;constructor(e,t,n,r,o,i,s,a){super("handleResponse"),this.responseBody=e,this.responseHeaders=t,this.status=n,this.statusText=r,this.destination=o,this.url=i,this.rawResponse=s,this.client=a}}class G extends Event{url;requestHeaders;body;method;destination;client;constructor(e,t,n,r,o,i){super("request"),this.url=e,this.requestHeaders=t,this.body=n,this.method=r,this.destination=o,this.client=i}response}class Y extends EventTarget{client;config;syncPool={};synctoken=0;cookieStore=new n.shared.CookieStore;serviceWorkers=[];constructor(){super(),this.client=new n.shared.util.BareClient;let e=indexedDB.open("$scramjet",1);e.onsuccess=()=>{let t=e.result.transaction("cookies","readonly").objectStore("cookies").get("cookies");t.onsuccess=()=>{t.result&&this.cookieStore.load(t.result)}},addEventListener("message",async({data:n})=>{if("scramjet$type"in n){if("scramjet$token"in n){let e=this.syncPool[n.scramjet$token];delete this.syncPool[n.scramjet$token],e(n);return}if("registerServiceWorker"===n.scramjet$type){this.serviceWorkers.push(new t(n.port,n.origin));return}"cookie"===n.scramjet$type&&(this.cookieStore.setCookies([n.cookie],new URL(n.url)),e.result.transaction("cookies","readwrite").objectStore("cookies").put(JSON.parse(this.cookieStore.dump()),"cookies")),"loadConfig"===n.scramjet$type&&(this.config=n.config)}})}async dispatch(e,t){let n,r=this.synctoken++,o=new Promise(e=>n=e);return this.syncPool[r]=n,t.scramjet$token=r,e.postMessage(t),await o}async loadConfig(){if(this.config)return;let e=indexedDB.open("$scramjet",1);return new Promise((t,o)=>{e.onsuccess=async()=>{let i=e.result.transaction("config","readonly").objectStore("config").get("config");i.onsuccess=async()=>{this.config=i.result,n.config=i.result,n.codec.encode=r("url",n.config.codec.encode),n.codec.decode=r("url",n.config.codec.decode),await F(),t()},i.onerror=()=>o(i.error)},e.onerror=()=>o(e.error)})}route({request:e}){return!!e.url.startsWith(location.origin+this.config.prefix)||!!e.url.startsWith(location.origin+this.config.files.wasm)}async fetch({request:e,clientId:t}){let n=await self.clients.get(t);return H.call(this,e,n)}}self.ScramjetServiceWorker=Y})();
//# sourceMappingURL=scramjet.worker.js.map