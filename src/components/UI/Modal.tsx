"use client";

import { useSearchParams } from "next/navigation";

import ChangePassword from "@/components/UI/ChangePassword";
import SignIn from "@/components/UI/SignIn";
import SignUp from "@/components/UI/SignUp";

const Modal = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  let content;

  if (mode === "sign-up") content = <SignUp />;
  if (mode === "sign-in") content = <SignIn />;
  if (mode === "change-password") content = <ChangePassword />;
  if (!mode) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-white md:bg-black/60">
      <dialog
        open
        className="z-20 max-w-[600px] w-full bg-white rounded-lg p-4 "
      >
        {content}
      </dialog>
    </div>
  );
};

export default Modal;
