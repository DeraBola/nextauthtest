import { doSocialLogin } from "@/app/actions";
import React from "react";

function LoginForm() {
  return (
    <form action={doSocialLogin} className="flex flex-col items-center space-y-4">
      <button type="submit" name="action" value="google" className="bg-green-500 text-white px-4 py-2 rounded">
        Sign In with Google
      </button>
      <button type="submit" name="action" value="github" className="bg-red-500 text-white px-4 py-2 rounded">
        Sign In with Github
      </button>
          <button type="submit" name="action" value="linkedin" className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign In with LinkedIn
      </button>
    </form>
  );
}

export default LoginForm;
