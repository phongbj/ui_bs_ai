/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldConfig, FormBaseProps } from "@/types/form";
import {
  Button,
  Checkbox,
  Field,
  Fieldset,
  FileUpload,
  HStack,
  Input,
  InputGroup,
  RadioGroup,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, FieldErrors, Path, useForm, UseFormReturn } from "react-hook-form";
import { HiUpload } from "react-icons/hi";
import { LuLock, LuMail, LuUser } from "react-icons/lu";
import { TypeOf, ZodSchema } from "zod";

const iconMap: Record<string, React.ElementType> = {
  LuLock: LuLock,
  LuUser: LuUser,
  LuMail: LuMail,
};

export function FormBase<T extends ZodSchema<any>>({
  schema,
  fields,
  onSubmit,
  columns = 2,
  disableForm,
  isSubmitting = false,
  submitButtonText = "등록",
  submitButtonClassName = "",
  triggerValidation,
  customErrors,
  formMethodsRef,
}: FormBaseProps<T>) {
  const formMethods = useForm<TypeOf<T>>({
    resolver: zodResolver(schema),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError,
  } = formMethods;

   useEffect(() => {
    if (formMethodsRef && typeof formMethodsRef === "object") {
      (formMethodsRef as React.RefObject<UseFormReturn<TypeOf<T>>>).current =
        formMethods;
    }
  }, [formMethodsRef, formMethods]);

  useEffect(() => {
    if (triggerValidation) {
      trigger();
    }
  }, [triggerValidation, trigger]);

  useEffect(() => {
    if (customErrors) {
      for (const key in customErrors) {
        const message = customErrors[key];
        if (message) {
          setError(key as unknown as Path<TypeOf<T>>, { type: "custom", message });
        }
      }
    }
  }, [customErrors, setError]); 

  const renderField = (field: FieldConfig<keyof TypeOf<T> & string>) => {
    const error = errors?.[field.name];

    switch (field.type) {
      case "text":
        return (
          <Field.Root
            key={field.name}
            className="flex flex-col"
            invalid={!!error}
          >
            <Field.Label>{field.label}{field.required && (
              <span style={{ color: field.requiredColor ?? "red", marginLeft: "0.25rem" }}>*</span>
            )}</Field.Label>
            <InputGroup
              startElement={
                field.icon
                  ? React.createElement(iconMap[field.icon], {
                    size: field.iconSize || 20,
                    color: field.iconColor || "gray",
                  })
                  : null
              }
            >
              <Input
                placeholder={field.placeholder}
                defaultValue={field.defaultValue}
                {...register(field.name as Path<TypeOf<T>>)}
                disabled={disableForm}
                className={`border p-2 rounded-lg pl-10 ${disableForm ? "bg-neutral-200 disabled:opacity-100" : ""
                  } ${field.disabled ? "bg-neutral-200 disabled:opacity-100" : ""
                  }`}
              />
            </InputGroup>
            {error && <Field.ErrorText>{`${error.message}`}</Field.ErrorText>}
          </Field.Root>
        );

      case "password":
        return (
          <Field.Root
            key={field.name}
            className="flex flex-col"
            invalid={!!error}
          >
            <Field.Label>{field.label}{field.required && (
              <span style={{ color: field.requiredColor ?? "red", marginLeft: "0.25rem" }}>*</span>
            )}</Field.Label>
            <InputGroup
              startElement={
                field.icon
                  ? React.createElement(iconMap[field.icon], {
                    size: field.iconSize || 20,
                    color: field.iconColor || "gray",
                  })
                  : null
              }
            >
              <Input
                type="password"
                placeholder={field.placeholder}
                {...register(field.name as Path<TypeOf<T>>)}
                disabled={disableForm}
                className={`border p-2 rounded-lg pl-10 ${disableForm ? "bg-neutral-200 disabled:opacity-100" : ""
                  } ${field.disabled ? "bg-neutral-200 disabled:opacity-100" : ""
                  }`}
              />
            </InputGroup>
            {error && <Field.ErrorText>{`${error.message}`}</Field.ErrorText>}
          </Field.Root>
        );

      case "radio":
        return (
          <Fieldset.Root key={field.name} invalid={!!error}>
            <Fieldset.Legend>{field.label}</Fieldset.Legend>
            <Controller
              name={field.name as Path<TypeOf<T>>}
              control={control}
              render={({ field: { onChange, value, name, onBlur } }) => (
                <RadioGroup.Root name={name} value={value} onChange={onChange}>
                  <HStack gap="6">
                    {field.options.map((opt) => (
                      <RadioGroup.Item
                        key={opt.value}
                        value={opt.value}
                        onBlur={onBlur}
                      >
                        <RadioGroup.ItemHiddenInput onBlur={onBlur} />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{opt.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </HStack>
                </RadioGroup.Root>
              )}
            />
            {error && (
              <Fieldset.ErrorText className="text-xs">{`${error.message}`}</Fieldset.ErrorText>
            )}
          </Fieldset.Root>
        );

      case "checkbox":
        return (
          <Controller
            control={control}
            name={field.name as Path<TypeOf<T>>}
            render={({ field: controllerField }) => (
              <Field.Root invalid={!!error} disabled={controllerField.disabled}>
                <Checkbox.Root
                  checked={controllerField.value}
                  onCheckedChange={({ checked }) =>
                    controllerField.onChange(checked)
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>{field.label}</Checkbox.Label>
                </Checkbox.Root>
                {error && (
                  <Field.ErrorText>{`${error.message}`}</Field.ErrorText>
                )}
              </Field.Root>
            )}
          />
        );

      case "file":
        return (
          <Field.Root
            key={field.name}
            className="flex flex-col"
            invalid={!!error}
          >
            <Field.Label>{field.label}</Field.Label>
            <FileUpload.Root accept={["image/png"]}>
              <FileUpload.HiddenInput
                {...register(field.name as Path<TypeOf<T>>)}
              />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                  <HiUpload /> Upload file
                </Button>
              </FileUpload.Trigger>
              <FileUpload.List />
            </FileUpload.Root>
            {error && <Field.ErrorText>{`${error.message}`}</Field.ErrorText>}
          </Field.Root>
        );
    }
  };

  const onValid = (data: TypeOf<T>) => {
    onSubmit(data);
  };

  const onInvalid = (errors: FieldErrors<TypeOf<T>>) => {
    console.error("❌ Form validation failed:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}
    >
      {fields.map(renderField)}
      <div
        className={`col-span-full flex justify-end ${disableForm ? "hidden" : ""
          } ${submitButtonClassName}`}
      >
        <Button
          loading = {isSubmitting}
          type="submit"
          className="bg-primary-400 text-white px-4 py-2 rounded-xl w-full"
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}
