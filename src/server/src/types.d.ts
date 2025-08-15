declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: string;
    };
    session: {
      id: string;
    };
  }
  export interface Response {
    user: any;
  }
}
