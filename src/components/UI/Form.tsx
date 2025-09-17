"use client";

import { ReactNode, useState } from "react";
import { useForm, FieldValues, Path } from "react-hook-form";
import Button from "./Button";
export type RegistrationResult = {
  success?: boolean;
  errors?: Record<string, string>;
};
const Form = <TFormData extends FieldValues>({
  children,
  submitAction,
  buttonText,
}: {
  children: (methods: ReturnType<typeof useForm<TFormData>>) => ReactNode;
  submitAction: (data: TFormData) => Promise<RegistrationResult>;
  href: string;
  buttonText: string;
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const methods = useForm<TFormData>();
  const { handleSubmit, reset, setError: setErrorRHF } = methods;

  const onSubmit = async (formData: TFormData) => {
    try {
      setLoading(true);
      const result = await submitAction(formData);

      setError(result.success === false);
      console.log(result.success);
      setSuccess(result.success === true);
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, value]) => {
          setErrorRHF(field as Path<TFormData>, {
            type: "server",
            message: value,
          });
        });
      } else if (result.success) {
        reset();
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>{children(methods)}</div>
      <div></div>

      <Button
        disabled={loading}
        className="bg-black text-white disabled:bg-zinc-800"
      >
        {buttonText}
      </Button>
      {success && (
        <div className="text-green-600 flex justify-center">Success!</div>
      )}
      {error && (
        <div className="text-red-600 flex justify-center">
          Fetching data failed.
        </div>
      )}
    </form>
  );
};

export default Form;
