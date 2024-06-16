import { SignUp, SignedOut } from "@clerk/nextjs";

const SingUpPage = () => {
  return (
    <SignedOut>
      <SignUp />
    </SignedOut>
  );
};

export default SingUpPage;
