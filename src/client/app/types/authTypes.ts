export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  email: string;
  user?: {
    id: string;
    name: string;
    role: string;
    avatar: string | null;
    email: string;
  };
}
