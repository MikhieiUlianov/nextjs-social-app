type DefaultProps = {
  placeholder: string;
  className?: string;
  name: string;
};

function Input({ placeholder, className, name }: DefaultProps) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      className={`rounded-sm w-full h-5 py-8 px-2 placeholder-gray-500 border-gray-400 border-x-2  border-y-2 ${className}`}
    />
  );
}

export default Input;
