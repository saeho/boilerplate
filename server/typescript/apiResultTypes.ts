
export type AuthType = {
  token: string | null;
  userId: string | null;
};

export type AuthenticateResult = {
  auth: AuthType;
};
