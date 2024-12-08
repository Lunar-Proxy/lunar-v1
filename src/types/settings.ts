export interface config {
  server: {
    port: number;
    assets: string;
  };
  protect: {
    challenge: boolean;
    users: {
      [username: string]: string;
    };
  };
}
