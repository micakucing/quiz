import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";
import Layout from "../components/Layout";

export default function Home() {
  const [publicQuizzes, setPublicQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicQuizzes();
  }, []);

  const fetchPublicQuizzes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "quizzes"), where("isPublished", "==", true));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPublicQuizzes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <Layout title="Kuisi" description="Buat dan jawab quiz publik dengan user lain" loading={loading}>

      <div className="container mt-5 mb-5">
        <h2>Quiz Publik</h2>

        {publicQuizzes.length === 0 && !loading && <p>Belum ada quiz yang dipublikasikan</p>}

        <div className="list-group">
          {publicQuizzes.map(q => (
            <Link key={q.id} href={`/quiz/${q.id}`} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <span>{q.title} - <small>oleh {q.authorName}</small></span>
              {q.isPublished && <span className="badge bg-success">Sudah Publik</span>}
            </Link>
          ))}
        </div>
      </div>
</Layout>
    </>
  );
}
