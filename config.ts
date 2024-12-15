import type { config } from '@src/types/settings';

const configuration: config = {
  // Cutomization for the server.
  server: {
    port: 8080, // This is what port lunar runs on. (Default: 8080)
  },

  // Protect your lunar link with a password. (Optional Feature)
  protect: {
    // This is if you want it to ask for a username and password for your link.
    // Set challenge to true to enable this feature. (Default: false)
    challenge: false,
    // This is only needed if challenge is set to true.
    logging: false, // If you want to say when a user logins. (default: false)
    // This is the username & password for the password protection
    users: {
      // Format: "username": "password"
      lunar: '123',
    },
  },
};

export default configuration;
