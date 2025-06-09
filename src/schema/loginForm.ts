import { FieldConfig } from "@/types/form";
import { z } from "zod";

export const loginSchema = z
  .object({
    user_ident: z.string(),
    password: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.user_ident.trim() || !data.password.trim()) {
      ctx.addIssue({
        path: ["user_ident"],
        code: z.ZodIssueCode.custom,
        message: "",
      });
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "이메일과 비밀번호를 모두 입력해주세요.",
      });
    }
  });

export const loginFields: FieldConfig<"user_ident" | "password">[] = [
  {
    type: "text",
    name: "user_ident",
    label: "Tài khoản",
    placeholder: "이메일을 입력해 주세요.",
    icon: "LuMail",
  },
  {
    type: "password",
    name: "password",
    label: "Mật khẩu",
    placeholder: "비밀번호를 입력해 주세요.",
    icon: "LuLock",
  },
];
