import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { auth, db } from "../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Loading overlay
function LoadingOverlay({ show }) {
  if (!show) return null;
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1050 }}
    >
      <div className="text-center">
        <div
          className="spinner-border text-light"
          style={{ width: "4rem", height: "4rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-3 text-white">Loading Quiz...</div>
      </div>
    </div>
  );
}
 

export default function QuizPage() {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const user = auth.currentUser;

  // Fetch quiz & leaderboard
  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      setLoading(true);
      try {
        // Fetch quiz data
        const quizRef = doc(db, "quizzes", id);
        const quizSnap = await getDoc(quizRef);
        if (quizSnap.exists()) {
          setQuiz(quizSnap.data());
        }

        // Fetch quiz answers
        const qAnswers = query(collection(db, "quizAnswers"), where("quizId", "==", id));
        const snapshot = await getDocs(qAnswers);
        const data = snapshot.docs.map(doc => ({ userId: doc.data().userId, ...doc.data() }));

        const uniqueUsers = new Set(data.map(d => d.userId));
        setParticipantsCount(uniqueUsers.size);

        const sortedLeaderboard = [...data].sort((a, b) => b.score - a.score);
        setLeaderboard(sortedLeaderboard);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  if (loading) return <LoadingOverlay show={true} />;
  if (!quiz) return <p className="text-center mt-5">Quiz tidak ditemukan</p>;
  if (!user) return <p className="text-center mt-5">Silahkan login untuk menjawab quiz</p>;

  // Handle pilih jawaban
  const handleSelect = (qIndex, optionIndex) => {
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  // Submit jawaban
  const handleSubmit = async () => {
    if (!quiz.questions || quiz.questions.length === 0) return;

    setSubmitting(true);
    try {
      let score = 0;
      quiz.questions.forEach((q, i) => {
        if (answers[i] === q.correct) score++;
      });

      // Simpan ke Firestore
      await addDoc(collection(db, "quizAnswers"), {
        quizId: id,
        userId: user.uid,
        name: user.displayName || user.email,
        answers,
        score,
        answeredAt: serverTimestamp(),
      });

      alert(`Jawaban berhasil dikirim! Skor Anda: ${score}`);
      router.reload(); // reload untuk update leaderboard & participant count
    } catch (err) {
      console.error(err);
      alert("Gagal submit jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  return (
             <Layout title={`Quiz oleh ${quiz.authorName}, diikuti ${participantsCount} peserta`} description="Buat dan jawab quiz publik dengan user lain" loading={loading}>
    
    <div className="container mt-5">
    

      <h2>{quiz.title}</h2>
      <p>Oleh: <strong>{quiz.authorName}</strong></p>
      <p>Jumlah peserta yang sudah menjawab: <strong>{participantsCount}</strong></p>

      <hr />

      {/* Pertanyaan */}
      {quiz.questions && quiz.questions.length > 0 ? (
        <div>
          {quiz.questions.map((q, index) => (
            <div key={index} className="mb-4">
              <h5>{index + 1}. {q.question}</h5>
              <ul className="list-group">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`list-group-item ${answers[index] === i ? "active" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelect(index, i)}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            className="btn btn-primary mt-3"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Mengirim..." : "Submit Jawaban"}
          </button>
        </div>
      ) : (
        <p>Belum ada pertanyaan pada quiz ini.</p>
      )}

      <hr />
 
    </div>
    </Layout>
  );
}
