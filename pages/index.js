import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const q = query(collection(db, "quizzes"), where("published", "==", true));
      const snap = await getDocs(q);
      const quizList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizList);
    };

    fetchQuizzes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Daftar Quiz Publik</h2>
        {quizzes.length === 0 ? (
          <p>Tidak ada quiz yang tersedia saat ini.</p>
        ) : (
          <ul className="list-group">
            {quizzes.map(quiz => (
              <li key={quiz.id} className="list-group-item d-flex justify-content-between align-items-center">
                <Link href={`/quiz/${quiz.id}`}>{quiz.title}</Link>
                <span className="badge bg-primary rounded-pill">{quiz.questions.length} Pertanyaan</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
