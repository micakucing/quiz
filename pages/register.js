import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

import Navbar from "../components/Navbar";
export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Nama wajib diisi");
    if (!email.trim()) return alert("Email wajib diisi");
    if (!password) return alert("Password wajib diisi");

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update displayName
      await updateProfile(userCredential.user, { displayName: name });

      alert("Registrasi berhasil!");
      router.push("/"); // redirect ke halaman index
    } catch (error) {
      console.error(error);
      alert(`Gagal registrasi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <Navbar />
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nama</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Mendaftar..." : "Register"}
        </button>
      </form>
    </div>
    </>
  );
}
