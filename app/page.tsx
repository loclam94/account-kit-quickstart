"use client";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import crypto from "crypto";

export default function Home() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();

  const saveUserToSessionStorage = () => {
    try {
      const ecdh = crypto.createECDH("prime256v1");
      ecdh.generateKeys();
      const userData = JSON.stringify({
        email: user?.email ?? "anon",
        name: user?.userId ?? "Unknown",
        publicKey: ecdh.getPublicKey("hex", "compressed"),
        privateKey: ecdh.getPrivateKey("hex"),
      });
      sessionStorage.setItem("user-info", userData);
      console.log("User data saved to sessionStorage:", userData);
    } catch (error) {
      console.error("Failed to save user to sessionStorage:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-4 justify-center text-center">
      {signerStatus.isInitializing ? (
        <>Loading...</>
      ) : user ? (
        <div className="flex flex-col gap-2 p-2">
          <p className="text-xl font-bold">Success!</p>
          Logged in as {user.email ?? "anon"}.
          <button
            className="btn btn-primary mt-6"
            onClick={() => {
              saveUserToSessionStorage();
              logout();
            }}
          >
            Log out
          </button>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={openAuthModal}>
          Login
        </button>
      )}
    </main>
  );
}
