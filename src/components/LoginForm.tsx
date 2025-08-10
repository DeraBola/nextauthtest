import { doSocialLogin } from "@/app/actions";
import React from "react";

function LoginForm() {
  return (
    <form action={doSocialLogin} className="flex flex-col items-center space-y-4">
      <button type="submit" name="action" value="google" className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign In with Google
      </button>
      <button type="submit" name="action" value="github" className="bg-green-500 text-white px-4 py-2 rounded">
        Sign In with Github
      </button>
    </form>
  );
}

export default LoginForm;
