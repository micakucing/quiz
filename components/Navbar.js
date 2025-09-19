import Link from 'next/link';
import { auth } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from "next/router";
export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    auth.onAuthStateChanged(u => setUser(u));
  }, []);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // redirect ke index
    } catch (error) {
      console.error("Logout gagal:", error);
      alert("Gagal logout");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/" className="navbar-brand">Kuisi</Link>
        <div>
          {user ? (
            <>
 
              <Link href="/dashboard" className="btn btn-sm btn-primary me-2">Dashboard</Link>
              <Link href="/leaderboard" className="btn btn-sm btn-info me-2">Leaderboard</Link>
              <button className="btn btn-sm btn-danger" onClick={() => handleLogout()}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-sm btn-primary me-2">Login</Link>
              <Link href="/register" className="btn btn-sm btn-success">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
