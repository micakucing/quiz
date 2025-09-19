import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";
import Navbar from "../components/Navbar";
import LoadingOverlay from "../components/Loadding";

export default function Home() {
  const [publicQuizzes, setPublicQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicQuizzes();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = publicQuizzes.filter(q =>
      q.title.toLowerCase().includes(term) ||
      q.authorName.toLowerCase().includes(term)
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, publicQuizzes]);

  const fetchPublicQuizzes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "quizzes"), where("isPublished", "==", true));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPublicQuizzes(data);
      setFilteredQuizzes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <LoadingOverlay show={loading} />

      <div className="container mt-5 mb-5">
        <h2>Quiz Publik</h2>

        {/* Search input */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Cari quiz berdasarkan judul atau pembuat..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredQuizzes.length === 0 && !loading ? (
          <p>Tidak ada quiz yang sesuai</p>
        ) : (
          <div className="list-group">
            {filteredQuizzes.map(q => (
              <Link key={q.id} href={`/quiz/${q.id}`} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                <span>{q.title} - <small>oleh {q.authorName}</small></span>
                {q.isPublished && <span className="badge bg-success">Sudah Publik</span>}
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-light text-center py-3">
        @ramahardian.my.id
      </footer>
    </>
  );
}
