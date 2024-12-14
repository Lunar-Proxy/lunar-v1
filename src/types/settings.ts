export interface config {
  server: {
    port: number;
    hosting: 'local' | 'external';
  };
  protect: {
    challenge: boolean;
    logging: boolean;
    users: {
      [username: string]: string;
    };
  };
}
