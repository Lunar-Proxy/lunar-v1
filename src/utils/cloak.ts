import settings from "../utils/config";

if (settings.prefences.cloak === true || settings.prefences.cloak === null) {
  cloak();
} else {
    console.log("Cloak is disabled, turn it on in settings.");
}

function cloak() {
  
}