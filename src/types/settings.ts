export interface Settings {
  server: {
    port: number;
  };
  protect: {
    challenge: boolean;
    users: {
      [username: string]: string;
    };
  };
}
