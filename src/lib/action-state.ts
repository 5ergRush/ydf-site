export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fields?: Record<string, string>;
};

export const initialAuthState: AuthActionState = { status: "idle" };

export type AccountActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export const initialAccountState: AccountActionState = { status: "idle" };
