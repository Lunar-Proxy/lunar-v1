import type { Settings } from "@src/types/settings";

const settings: Settings = {
  // Cutomization for the server.
  server: {
    port: 8080, // This is what port lunar runs on. (Default: 8080)
  },

  // Protect your lunar link with a password. (Optional Feature)
  protect: {
    // This is if you want it to ask for a username and password for your link.
    // Set challenge to true to enable this feature. (Default: false)
    challenge: false,
    // This is the username for the challenge.
    // This is only needed if challenge is set to true.
    users: {
      // Format: "username": "password"
      lunar: "123",
    },
  },
};

export default settings;
