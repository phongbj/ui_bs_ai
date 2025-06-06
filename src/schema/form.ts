import { FieldConfig } from "@/types/form";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  agree: z.boolean().refine((val) => val === true, {
    message: "Agree is required",
  }),
  file: z.any().refine((f) => f?.length > 0, { message: "File is required" }),
});

export const fields: FieldConfig<"name" | "gender" | "agree" | "file">[] = [
  { type: "text", name: "name", label: "Name" },
  {
    type: "radio",
    name: "gender",
    label: "Gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
  },
  { type: "checkbox", name: "agree", label: "I agree to terms" },
  { type: "file", name: "file", label: "Upload File" },
];
