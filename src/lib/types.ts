export type State = {
  message?: string | null;
  errors?: {
    [key: string]: string[];
  };
};
