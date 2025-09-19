import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  const [publicQuizzes, setPublicQuizzes] = useState([]);

  useEffect(() => {
    fetchPublicQuizzes();
  }, []);

  const fetchPublicQuizzes = async () => {
    const q = query(collection(db, "quizzes"), where("isPublished", "==", true));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPublicQuizzes(data);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Quiz Publik</h2>
        {publicQuizzes.length === 0 ? (
          <p>Belum ada quiz yang dipublikasikan</p>
        ) : (
          <div className="list-group">
            {publicQuizzes.map(q => (
              <Link key={q.id} href={`/quiz/${q.id}`} className="list-group-item list-group-item-action">
                {q.title} - <small>oleh {q.authorName}</small>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
