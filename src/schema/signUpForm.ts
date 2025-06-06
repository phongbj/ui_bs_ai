import { FieldConfig } from "@/types/form";
import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, "이름은 필수값 입니다."),

    user_ident: z
      .string()
      .min(1, "이메일은 필수값 입니다.")
      .email("유효한 이메일을 입력해 주세요."),

    password: z
      .string()
      .min(1, "비밀번호는 필수값 입니다.")
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
      .regex(/[a-z]/, "비밀번호에 소문자가 포함되어야 합니다.")
      .regex(/[A-Z]/, "비밀번호에 대문자가 포함되어야 합니다.")
      .regex(/[0-9]/, "비밀번호에 숫자가 포함되어야 합니다.")
      .regex(/[^A-Za-z0-9]/, "비밀번호에 특수문자가 포함되어야 합니다."),

    confirmPassword: z
      .string()
      .min(1, "비밀번호 확인은 필수값 입니다.")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "입력한 비밀번호와 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export const signUpFields: FieldConfig<"name" | "user_ident" | "password" | "confirmPassword">[] = [
  {
    type: "text",
    name: "name",
    label: "성명",
    placeholder: "이름을 입력해 주세요.",
    icon: "LuUser",
    required: true,
    requiredColor: "#00A5E5"
  },
  {
    type: "text",
    name: "user_ident",
    label: "E-mail",
    placeholder: "이메일을 입력해 주세요.",
    icon: "LuMail",
    required: true,
    requiredColor: "#00A5E5"
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "비밀번호를 입력해 주세요.",
    icon: "LuLock",
    required: true,
    requiredColor: "#00A5E5"
  },
  {
    type: "password",
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "비밀번호를 다시 한번 입력해 주세요.",
    icon: "LuLock",
    required: true,
    requiredColor: "#00A5E5"
  },
];
