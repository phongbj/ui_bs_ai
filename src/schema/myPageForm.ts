import { FieldConfig } from "@/types/form";
import { z } from "zod";

export const myPageSchema = z.object({
  name: z.string().min(1, "이름을 입력해 주세요"),
  email: z.string().email("유효한 이메일을 입력해 주세요"),
});

export const myPageFields: FieldConfig<"name" | "email">[] = [
  {
    type: "text",
    name: "name",
    label: "이름",
    placeholder: "김희제",
    icon: "LuUser",
    // disabled: true,
  },
  {
    type: "text",
    name: "email",
    label: "이메일",
    placeholder: "Lucas@opimdigital.com",
    icon: "LuMail",
    // disabled: true,
  },
];
