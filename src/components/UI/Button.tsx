import Link, { LinkProps } from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";

/* const Button = ({
  children,
  href,
  className,
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <div className="flex justify-center">
      <Link
        href={href}
        className={`max-w-[300px] my-4 rounded-2xl font-bold w-full p-1 text-center ${
          className || " bg-white text-black"
        }`}
      >
        {children}
      </Link>
    </div>
  );
};

export default Button;
 */
type DefaultProps = {
  children: ReactNode;
  className: string;
};
type AnchorProps = LinkProps & { onClick?: never };

type ButtonProps = ComponentPropsWithoutRef<"button"> & { href?: never };

type PropsType = AnchorProps | ButtonProps;

const isAnchorProps = (props: PropsType): props is AnchorProps => {
  return "href" in props;
};
const Button = (props: PropsType & DefaultProps) => {
  const { children, className } = props;

  if (isAnchorProps(props)) {
    const { href, ...otherProps } = props;
    return (
      <div className="flex justify-center">
        <Link
          href={href}
          {...otherProps}
          className={`max-w-[300px] my-4 rounded-2xl font-bold w-full p-1 text-center ${
            className || " bg-white text-black"
          }`}
        >
          {children}
        </Link>
      </div>
    );
  }

  const { ...otherProps } = props;
  return (
    <div className="flex justify-center">
      <button
        {...otherProps}
        className={`max-w-[300px] my-4 rounded-2xl font-bold w-full p-1 text-center ${
          className || " bg-white text-black"
        }`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
