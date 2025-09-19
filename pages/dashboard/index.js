import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/router";
import Link from "next/link";
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", ""], answer: "" }]);
  const [editId, setEditId] = useState(null); // id quiz yang sedang diedit
  const router = useRouter();

  // Listen auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch quiz user
  useEffect(() => {
    if (!user) return;

    const fetchUserQuizzes = async () => {
      const q = query(collection(db, "quizzes"), where("creatorId", "==", user.uid));
      const snap = await getDocs(q);
      setQuizzes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchUserQuizzes();
  }, [user]);
 

  const handleEditQuiz = (quiz) => {
    setEditId(quiz.id);
    setTitle(quiz.title);
    setQuestions(quiz.questions);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus quiz ini?")) return;
    await deleteDoc(doc(db, "quizzes", quizId));
    setQuizzes(quizzes.filter(q => q.id !== quizId));
    alert("Quiz berhasil dihapus!");
  };

  const togglePublish = async (quizId, current) => {
    await updateDoc(doc(db, "quizzes", quizId), { published: !current });
    setQuizzes(quizzes.map(q => q.id === quizId ? { ...q, published: !current } : q));
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Silakan login untuk mengakses dashboard.</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Dashboard User</h2>
 <div className="d-flex flex-column gap-3 mt-4">
          <Link href="/dashboard/profile" className="btn btn-primary">Lihat Profile</Link>
          <Link href="/dashboard/create-quiz" className="btn btn-success">Buat Quiz Baru</Link>
        </div>
       
        {/* Daftar Quiz User */}
        <h4>Quiz Saya</h4>
        {quizzes.length === 0 ? (
          <p>Belum ada quiz.</p>
        ) : (
          <ul className="list-group">
            {quizzes.map(q => (
              <li key={q.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <span>{q.title}</span>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>Pertanyaan: {q.questions.length}</p>
                </div>
                <div>
                  <button className={`btn btn-sm me-1 ${q.published ? "btn-success" : "btn-secondary"}`} onClick={() => togglePublish(q.id, q.published)}>
                    {q.published ? "Dipublikasikan" : "Publish"}
                  </button>
                  <button className="btn btn-sm btn-info me-1" onClick={() => handleEditQuiz(q)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteQuiz(q.id)}>Hapus</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
