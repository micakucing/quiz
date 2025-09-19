import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Layout from "../../components/Layout";
import Link from "next/link";

export default function Dashboard() {
  const [quizCreated, setQuizCreated] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    fetchQuizCreated(auth.currentUser.uid);
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = quizCreated.filter(q =>
      q.title.toLowerCase().includes(term)
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizCreated]);

  const fetchQuizCreated = async (uid) => {
    try {
      const q = query(collection(db, "quizzes"), where("authorId", "==", uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizCreated(data);
      setFilteredQuizzes(data);
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
      setFilteredQuizzes(filteredQuizzes.filter(q => q.id !== quizId));
      alert("Quiz berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus quiz");
    }
  };

  const handleTogglePublish = async (quizId, currentStatus) => {
    try {
      await updateDoc(doc(db, "quizzes", quizId), { isPublished: !currentStatus });
      const updated = quizCreated.map(q => q.id === quizId ? { ...q, isPublished: !currentStatus } : q);
      setQuizCreated(updated);
      setFilteredQuizzes(updated.filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase())));
      alert(`Quiz berhasil ${currentStatus ? "dinonaktifkan (Draft)" : "dipublikasikan"}`);
    } catch (error) {
      console.error(error);
      alert("Gagal mengubah status publikasi quiz");
    }
  };

  if (loading) return 
        <div className="container mt-5">

  <p>Loading...</p>
  </div>
  ;

  return (
    <>
             <Layout title="Kuisi Publik | Dashboard " description="Buat dan jawab quiz publik dengan user lain" loading={loading}>
    
      <div className="container mt-5">
        <h2>Dashboard</h2>
        <Link href="/dashboard/create-quiz" className="btn btn-success mb-3">Buat Quiz Baru</Link>
        <Link href="/dashboard/profile" className="btn ms-3 btn-primary mb-3">Profile</Link>

        {/* Search input */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Cari quiz berdasarkan judul..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredQuizzes.length === 0 ? (
          <p>Tidak ada quiz yang sesuai</p>
        ) : (
              <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Judul Quiz</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map(q => (
                <tr key={q.id}>
                  <td>{q.title}</td>
                  <td>
                    {q.isPublished ? (
                      <span className="badge bg-success">Sudah Publik</span>
                    ) : (
                      <span className="badge bg-secondary">Draft</span>
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
          </div>
        )}
      </div>
      </Layout>
    </>
  );
}
