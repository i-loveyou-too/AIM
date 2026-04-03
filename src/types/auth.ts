export type TeacherLoginPayload = {
  username: string;
  password: string;
  next?: string;
};

export type AuthUser = {
  id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
  role?: "teacher" | "student";
  display_name?: string;
  header_name?: string;
  greeting_name?: string;
  initials?: string;
  role_label?: string;
};

export type TeacherLoginApiResponse = {
  authenticated?: boolean;
  message?: string;
  detail?: string;
  next?: string;
  user?: AuthUser;
};

export type TeacherLoginResult =
  | {
      ok: true;
      nextPath: string;
      user: AuthUser;
      raw?: TeacherLoginApiResponse | null;
    }
  | {
      ok: false;
      error: string;
    };

export type AuthMeApiResponse = {
  authenticated: boolean;
  user?: AuthUser;
  message?: string;
  detail?: string;
};
