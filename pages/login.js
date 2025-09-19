import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Layout from "../components/Layout";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const router = useRouter();

  const showNotification = (message, type = "danger") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000); // auto-hide
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification("✅ Login berhasil! Mengalihkan ke halaman utama...", "success");

      // redirect ke halaman index setelah 1 detik
      setTimeout(() => {
        router.push("/");
      }, 1000);

    } catch (error) {
      console.error(error);
      let message = "Login gagal. Silakan coba lagi.";
      if (error.code === "auth/wrong-password") message = "⚠️ Password salah.";
      else if (error.code === "auth/user-not-found") message = "⚠️ User tidak ditemukan.";
      else if (error.code === "auth/invalid-email") message = "⚠️ Email tidak valid.";
      showNotification(message, "danger");
    }
  };

return (
    <>
             <Layout title="Kuisi Publik | halaman login" description="Buat dan jawab quiz publik dengan user lain"  >

      <div className="container mt-5">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn btn-primary" type="submit">Login</button>
        </form>

        <p className="mt-2">
          <a href="/reset-password">Lupa password? Klik di sini</a>
        </p>
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
      </Layout>
    </>
  );
}
