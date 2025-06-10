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
        message: "Vui lòng nhập cả tài khoản và mật khẩu.",
      });
    }
  });

export const loginFields: FieldConfig<"user_ident" | "password">[] = [
  {
    type: "text",
    name: "user_ident",
    label: "Tài khoản",
    placeholder: "Nhập tài khoản.",
    icon: "LuMail",
  },
  {
    type: "password",
    name: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu.",
    icon: "LuLock",
  },
];
