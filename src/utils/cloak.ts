import { Settings } from "../utils/config";

if (await Settings.get("Cloak")) {
  Cloak();
} else {
  console.debug("Cloaking is disabled");
}

function Cloak() {}
