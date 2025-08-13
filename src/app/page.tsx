import CognitoComponent from "@/components/CognitoComponent";
// import LoginForm from "@/components/LoginForm";

export default function Home() {

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <h1 className="text-3xl my-3">Hey, time to sign in</h1>
      <CognitoComponent />
    </div>
  );
}
