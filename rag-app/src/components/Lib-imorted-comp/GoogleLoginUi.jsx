import { useEffect } from "react";
import { auth } from "../../../firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { GoogleAuthProvider } from "firebase/auth";

const GoogleLoginUI = () => {
  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    ui.start("#firebaseui-auth-container", {
      signInOptions: [GoogleAuthProvider.PROVIDER_ID],
      signInFlow: "popup",
      callbacks: {
        signInSuccessWithAuthResult: () => false,
      },
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center ">
      <h1 className="text-2xl mb-6 text-white">Sign in to continue</h1>
      <div id="firebaseui-auth-container" />
    </div>
  );
};

export default GoogleLoginUI;
