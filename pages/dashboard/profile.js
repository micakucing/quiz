import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Layout from "../../components/Layout";
import Link from "next/link";
import { updateProfile, updateEmail, sendPasswordResetEmail } from "firebase/auth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [quizCreated, setQuizCreated] = useState([]);
  const [quizAnswered, setQuizAnswered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
      fetchQuizCreated(currentUser.uid);
      fetchQuizAnswered(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, []);

  // Ambil quiz yang dibuat user
  const fetchQuizCreated = async (uid) => {
    try {
      const q = query(collection(db, "quizzes"), where("authorId", "==", uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizCreated(data);
    } catch (error) {
      console.error("Gagal ambil quiz dibuat:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ambil quiz yang sudah dijawab user
  const fetchQuizAnswered = async (uid) => {
    try {
      const q = query(collection(db, "user_quiz"), where("userId", "==", uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizAnswered(data);
    } catch (error) {
      console.error("Gagal ambil quiz dijawab:", error);
    }
  };

  // Hapus quiz yang dibuat
  const handleDeleteQuiz = async (quizId) => {
    if (!confirm("Yakin ingin menghapus quiz ini?")) return;
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      setQuizCreated(quizCreated.filter(q => q.id !== quizId));
      alert("Quiz berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus quiz");
    }
  };

  // Update nama
  const handleUpdateName = async () => {
    if (!name.trim()) return alert("Nama tidak boleh kosong");
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      setUser({ ...user, displayName: name });
      alert("Nama berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui nama");
    }
  };

  // Update email
  const handleUpdateEmail = async () => {
    if (!email.trim()) return alert("Email tidak boleh kosong");
    try {
      await updateEmail(auth.currentUser, email);
      setUser({ ...user, email });
      alert("Email berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui email: " + error.message);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      alert("Email reset password terkirim. Cek inbox email Anda.");
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim reset password: " + error.message);
    }
  };

  if (loading) return <div className="container mt-5">
    <p>Loading...</p> </div>;
  if (!user) return <div className="container mt-5"><p>Silakan <Link href="/login">login</Link> untuk melihat profile.</p> </div>;

  return (
    <>
      <Layout title={`Halaman Profile ${name}`} description="Buat dan jawab quiz publik dengan user lain" loading={loading}>

        <div className="container mt-5">
          <h2>Profile</h2>

          {/* Info & update user */}
          <div className="mb-4">
            <label className="form-label"><strong>Nama</strong></label>
            <input
              type="text"
              className="form-control mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-primary mb-3" onClick={handleUpdateName}>Update Nama</button>

            <label className="form-label" style={{ display: "block" }}><strong>Email</strong></label>
            <input
              type="email"
              className="form-control mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary mb-3 me-2" onClick={handleUpdateEmail}>Update Email</button>
            <button className="btn btn-warning mb-3" onClick={handleResetPassword}>Reset Password</button>
          </div>

          <p><strong>Quiz dibuat:</strong> {quizCreated.length}</p>

          {/* Quiz yang dibuat user */}
          <div className="mt-4">
            <h4>Quiz yang Dibuat</h4>
            {quizCreated.length === 0 ? (
              <p>Belum membuat quiz</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Judul Quiz</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {quizCreated.map((q) => (
                    <tr key={q.id}>
                      <td>{q.title}</td>
                      <td>
                        <Link href={`/dashboard/edit-quiz/${q.id}`} className="btn btn-sm btn-primary me-2">
                          Edit
                        </Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteQuiz(q.id)}>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Quiz yang sudah dijawab user */}
          <div className="mt-4">
            <h4>Quiz yang Sudah Dijawab</h4>
            {quizAnswered.length === 0 ? (
              <p>Belum menjawab quiz</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Judul Quiz</th>
                    <th>Skor</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {quizAnswered.map((q) => (
                    <tr key={q.id}>
                      <td>{q.quizTitle}</td>
                      <td>{q.score}</td>
                      <td>{new Date(q.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
