
export type AuthType = {
  token: string | null;
  userId: string | null;
};

export type CanvasSessionType = {
  selectedTool: string;
  canvasData: string;
  history: any[];
};

export type AuthenticateResult = {
  auth: AuthType;
  canvasSession: CanvasSessionType;
};
