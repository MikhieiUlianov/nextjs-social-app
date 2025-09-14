import Link from "next/link";
import Image from "../Image";
import Input from "./Input";
import Button from "./Button";
import Form from "./Form";

const SignUp = () => {
  return (
    <>
      <div className="flex justify-between px-2">
        <Link href="registration">
          <svg width={32} viewBox="0 0 24 24" className="cursor-pointer">
            <path
              fill="#000000"
              d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
            />
          </svg>
        </Link>
        <Image
          className="bg-black"
          path="icons/logo.svg"
          w={30}
          h={30}
          alt="logo"
        />
      </div>
      {/* CENTER */}
      <div className="flex flex-col ">
        <h2 className="font-bold text-2xl py-4 text-black ">
          Create your account
        </h2>
        <Form submitAction={() => {}} href="/" buttonText="Sign up">
          {({ register, formState: { errors } }) => {
            return (
              <>
                <Input name="name" placeholder="Name" className="mt-4" />
                <Input name="email" placeholder="Email" className="mt-4" />
                <Input
                  name="password"
                  placeholder="Password"
                  className="mt-4"
                />
                <Input
                  name="verifyPassword"
                  placeholder="Verify password"
                  className="mt-4"
                />
              </>
            );
          }}
        </Form>
      </div>
      <div className="justify-center flex gap-2 pt-3">
        Already have an account?
        <Link href={"/registration/?mode=sign-in"} className="text-cyan-500">
          Sign in
        </Link>
      </div>
    </>
  );
};

export default SignUp;
