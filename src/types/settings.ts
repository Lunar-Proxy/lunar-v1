export interface config {
  server: {
    port: number;
  };
  protect: {
    challenge: boolean;
    logging: boolean;
    users: {
      [username: string]: string;
    };
  };
}
