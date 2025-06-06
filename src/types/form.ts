/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { TypeOf, ZodSchema } from "zod";

type BaseField<Name extends string> = {
  name: Name;
  label: string;
  disabled?: boolean;
};

export type InputType = "text" | "password" | "email" | "number";

export type TextField<Name extends string> = BaseField<Name> & {
  type: InputType;
  placeholder?: string;
  defaultValue?: string;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  required?: boolean;
  requiredColor?: string;
};

export type PasswordField<Name extends string> = BaseField<Name> & {
  type: "password";
  placeholder?: string;
  icon?: string;
  required?: boolean;
  requiredColor?: string;
};

export type RadioField<Name extends string> = {
  type: "radio";
  name: Name;
  label: string;
  options: { label: string; value: string }[];
  required?: boolean;
  requiredColor?: string;
};

export type CheckboxField<Name extends string> = {
  type: "checkbox";
  name: Name;
  label: string;
  required?: boolean;
  requiredColor?: string;
};

export type FileField<Name extends string> = {
  type: "file";
  name: Name;
  label: string;
  required?: boolean;
  requiredColor?: string;
};

export type FieldConfig<Name extends string> =
  | TextField<Name>
  | RadioField<Name>
  | CheckboxField<Name>
  | FileField<Name>;

export type FormBaseProps<T extends ZodSchema<any>> = {
  schema: T;
  fields: FieldConfig<keyof TypeOf<T> & string>[];
  onSubmit: (data: TypeOf<T>) => void;
  columns?: number;
  disableForm?: boolean;
  submitButtonText?: string;
  submitButtonClassName?: string;
  isSubmitting?: boolean;
  triggerValidation?: boolean;
  customErrors?: Partial<Record<keyof TypeOf<T>, string>>;
  formMethodsRef?: React.RefObject<ReturnType<typeof useForm<TypeOf<T>>> | null>;
};