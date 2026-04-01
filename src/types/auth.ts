export type TeacherLoginPayload = {
  username: string;
  password: string;
};

export type TeacherLoginApiResponse = {
  success?: boolean;
  detail?: string;
  next?: string;
};

export type TeacherLoginResult =
  | {
      ok: true;
      nextPath: string;
      raw?: TeacherLoginApiResponse | null;
    }
  | {
      ok: false;
      error: string;
    };
