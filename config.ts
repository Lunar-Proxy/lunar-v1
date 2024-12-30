interface ConfigTypes {
  port: number;
  auth: {
    protect: boolean;
    log: boolean;
    users: { [username: string]: string }[];
  };
}

const config: ConfigTypes = {
  port: 8080, // The port lunar runs on (Default: 8080)
  auth: {
    protect: false, // Enable or disable authentication (Default: false)
    log: true, // Logs when a user logs in (Default: true)
    users: [
      {
        lunar: 'lunariscool', // Replace to whatever you want format is username: "password"
      },
      // To add more users, follow this format:
      // { username: "password" },
    ],
  },
};

export default config;
