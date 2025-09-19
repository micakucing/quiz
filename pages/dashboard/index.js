import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function Dashboard() {
  const [quizCreated, setQuizCreated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    fetchQuizCreated(auth.currentUser.uid);
  }, []);

  const fetchQuizCreated = async (uid) => {
    try {
      const q = query(collection(db, "quizzes"), where("authorId", "==", uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizCreated(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleTogglePublish = async (quizId, currentStatus) => {
    try {
      await updateDoc(doc(db, "quizzes", quizId), { isPublished: !currentStatus });
      setQuizCreated(
        quizCreated.map(q => q.id === quizId ? { ...q, isPublished: !currentStatus } : q)
      );
      alert(`Quiz berhasil ${currentStatus ? "dinonaktifkan" : "dipublikasikan"}`);
    } catch (error) {
      console.error(error);
      alert("Gagal mengubah status publikasi quiz");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Dashboard</h2>
        <Link href="/dashboard/create-quiz" className="btn btn-success mb-3">Buat Quiz Baru</Link>
        <Link href="/dashboard/profile" className="btn btn-primary mb-3 ms-3">Profil Saya</Link>

        {quizCreated.length === 0 ? (
          <p>Belum membuat quiz</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Judul Quiz</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {quizCreated.map(q => (
                <tr key={q.id}>
                  <td>{q.title}</td>
                  <td>
                    {q.isPublished ? (
                      <span className="badge bg-success">Sudah Publik</span>
                    ) : (
                      <span className="badge bg-secondary">Belum Publik</span>
                    )}
                  </td>
                  <td>
                    <Link href={`/dashboard/edit-quiz/${q.id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                    <button className="btn btn-sm btn-danger me-2" onClick={() => handleDeleteQuiz(q.id)}>Hapus</button>
                    <button
                      className={`btn btn-sm ${q.isPublished ? "btn-warning" : "btn-success"}`}
                      onClick={() => handleTogglePublish(q.id, q.isPublished)}
                    >
                      {q.isPublished ? "Unpublish" : "Publikasikan"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
