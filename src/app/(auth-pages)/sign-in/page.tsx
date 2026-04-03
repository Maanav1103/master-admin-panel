
import { SignIn } from "@/components/pages/Auth/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = () => {
  return <SignIn />;
};

export default SignInPage;
