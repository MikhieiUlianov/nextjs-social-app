"use client";

import { ReactNode, useState } from "react";
import { useForm, Path, FieldValues } from "react-hook-form";
import Button from "./Button";

const Form = <TFormData extends FieldValues>({
  children,
  submitAction,
  href,
  buttonText,
}: {
  children: (methods: ReturnType<typeof useForm<TFormData>>) => ReactNode;
  submitAction: (data: TFormData) => void;
  href: string;
  buttonText: string;
}) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const methods = useForm<TFormData>();
  const { handleSubmit, register, reset } = methods;

  const onSubmit = async (formData: TFormData) => {
    try {
      setLoading(true);
      const result = await submitAction(formData);

      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went Wrong");
    }
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>{children(methods)}</div>
      <div> {error !== "" && <div>{error}</div>}</div>

      <Button disabled={loading} className="bg-black text-white">
        {buttonText}
      </Button>
    </form>
  );
};

export default Form;
