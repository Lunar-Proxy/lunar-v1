export interface config {
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
