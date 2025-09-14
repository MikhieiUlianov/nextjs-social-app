import Image from "@/components/Image";
import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import Link from "next/link";

const Registration = () => {
  return (
    <>
      <Modal />
      <div className="h-screen flex flex-col items-center justify-between p-8 lg:flex-row lg:p-20">
        <div className="py-2 mr-auto lg:hidden">
          <Image
            className="ml-auto"
            path="icons/logo.svg"
            w={30}
            h={30}
            alt="logo"
          />
        </div>
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="320"
            height="320"
            viewBox="0 0 24 24"
          >
            <path
              fill="white"
              d="M 26.609375 29.023438 L 3.425781 29.023438 L 3.425781 26.707031 L 24.3125 26.707031 L 24.3125 23.242188 L 3.390625 23.242188 L 3.441406 0.015625 L 11.46875 0.015625 L 11.46875 17.117188 L 9.167969 17.117188 L 9.167969 2.335938 L 5.738281 2.335938 L 5.695312 20.925781 L 26.609375 20.925781 L 26.609375 29.023438"
            />
          </svg>
        </div>
        <div className="flex flex-col  w-full max-w-md ">
          <h1 className="text-left font-bold my-8 text-5xl xsm:text-7xl">
            Happening now
          </h1>
          <h2 className="mb-4 font-semibold text-xl xsm:text-2xl">
            Join today.
          </h2>
          <div>
            <Button href="/registration/?mode=sign-up">
              Create an account
            </Button>
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <span className="relative px-2 font-bold bg-white rounded-full text-gray-500">
                or
              </span>
            </div>
            <Button href="/registration/?mode=sign-in">Sign In</Button>
            <p className="my-4 text-sm">
              By signing up, you agree to the
              <span className="text-cyan-500 p-1">Terms of Service</span> and
              <span className="text-cyan-500 p-1">Privacy Policy</span>,
              including
              <span className="text-cyan-500 p-1">Cookie Use.</span>
            </p>

            <h3 className="font-bold text-white ">Do you need some help?</h3>
            <Link className="text-cyan-500" href="/">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
