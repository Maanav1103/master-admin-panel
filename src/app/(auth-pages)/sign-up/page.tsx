import { SignUp } from "@/components/pages/Auth/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = () => {
  return <SignUp />;
};

export default SignUpPage;
