import { useState } from "react";
import { auth } from "../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const router = useRouter();

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000); // auto-hide 4 detik
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      showNotification("✅ Link reset password telah dikirim! Mengalihkan ke login...", "success");

      // redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      console.error(error);
      let message = "❌ Gagal mengirim link reset password.";
      if (error.code === "auth/user-not-found") message = "⚠️ User tidak ditemukan.";
      else if (error.code === "auth/invalid-email") message = "⚠️ Email tidak valid.";
      showNotification(message, "danger");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">Kirim Link Reset</button>
        </form>
      </div>

      {/* Toast */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <div className={`toast align-items-center text-bg-${toastType} ${showToast ? "show" : "hide"}`} role="alert">
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
          </div>
        </div>
      </div>
    </>
  );
}
