import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
};
type DefaultProps<T extends FieldValues> = {
  placeholder: string;
  className?: string;
  name: string;
  type: string;
} & InputProps<T>;

const Input = <T extends FieldValues>({
  placeholder,
  className,
  name,
  type,
  register,
  errors,
}: DefaultProps<T>) => {
  let validationLogic: RegisterOptions<T, Path<T>> = {
    required: "This field is required",
  };

  if (type === "text") {
    validationLogic.minLength = {
      value: 2,
      message: "Name must have at least 2 characters.",
    };
    validationLogic.maxLength = {
      value: 30,
      message: "Name cannot have more than 30 characters.",
    };
  }
  if (type === "email") {
    validationLogic.pattern = {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address.",
    };
  }

  if (type === "password") {
    validationLogic.minLength = {
      value: 8,
      message: "Password must be at least 8 characters long.",
    };
    validationLogic.pattern = {
      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      message:
        "Password must contain at least one uppercase letter, one number, and one special character.",
    };
  }

  return (
    <>
      <input
        type={type}
        {...register(name, validationLogic)}
        name={name}
        placeholder={placeholder}
        className={`rounded-sm w-full h-5 py-8 px-2 placeholder-gray-500 border-gray-400 border-x-2  border-y-2 ${className}`}
      />
      {errors[name]?.message && (
        <div className="text-red-600">{errors[name].message as string}</div>
      )}
    </>
  );
};

export default Input;
