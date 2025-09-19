import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";

// Loading overlay
function LoadingOverlay({ show }) {
  if (!show) return null;
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1050 }}
    >
      <div className="text-center">
        <div className="spinner-border text-light" style={{ width: "4rem", height: "4rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-3 text-white">Loading Dashboard...</div>
      </div>
    </div>
  );
}
export default function Dashboard() {
 const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // <--- state searchTerm
  const [quizzes, setQuizzes] = useState([]);
  // Filter quizzes
  const filteredQuizzes = quizzes.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login"); // redirect jika belum login
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch quizzes after user is ready
  useEffect(() => {
    if (!user) return; // tunggu user

    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "quizzes"), where("authorId", "==", user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuizzes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [user]);

  if (loading) return <LoadingOverlay show={true} />;

  return (
    <>
             <Layout title="Kuisi Publik | Dashboard " description="Buat dan jawab quiz publik dengan user lain" >
    
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
                    <Link href={`/dashboard/edit-quiz/${q.id}`} className="btn btn-sm btn-primary me-2 mb-xl-0 mb-2">Edit</Link>
                    <button className="btn btn-sm btn-danger me-2  me-2 mb-xl-0 mb-2" onClick={() => handleDeleteQuiz(q.id)}>Hapus</button>
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
