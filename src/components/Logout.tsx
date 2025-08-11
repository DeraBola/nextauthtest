import { doLogout } from "@/app/actions";
import React from "react";

function Logout() {
  return (
    <form action={doLogout} className="flex flex-col items-center space-y-4">
      <button type="submit"  className="bg-green-500 text-white px-4 py-2 rounded">
       Logout
      </button>
      
    </form>
  );
}

export default Logout;
