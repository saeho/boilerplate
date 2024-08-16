
export type APIUser = {
  loggedIn: boolean;
  userId: string | null;
};

export type APIContext = {
  token: string | null;
  ipAddress: string;
};
