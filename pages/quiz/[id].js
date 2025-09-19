import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Navbar from "../../components/Navbar";

export default function QuizPage() {
  const router = useRouter();
  const { id } = router.query;

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  // Toast notification
  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Ambil data quiz dari Firestore
  useEffect(() => {
    if (!id) return;
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, "quizzes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuiz(docSnap.data());
        } else {
          showNotification("Quiz tidak ditemukan", "danger");
        }
      } catch (error) {
        console.error(error);
        showNotification("Gagal mengambil quiz", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!quiz) return <p>Quiz tidak tersedia.</p>;

  // Handle jawaban user
  const handleChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  // Hitung skor
  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) score += 1;
    });
    return Math.round((score / quiz.questions.length) * 100);
  };

  // Submit jawaban
  const handleSubmit = async () => {
    if (!auth.currentUser) {
      showNotification("Silakan login untuk mengirim jawaban", "danger");
      return;
    }
    try {
      const score = calculateScore();
      await addDoc(collection(db, "user_quiz"), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Anonymous",
        quizId: id,
        quizTitle: quiz.title,
        score,
        timestamp: Date.now()
      });
      showNotification(`Jawaban berhasil dikirim! Skor: ${score}`, "success");

      // Redirect ke profile setelah 2 detik
      setTimeout(() => router.push("/profile"), 2000);
    } catch (error) {
      console.error(error);
      showNotification("Gagal mengirim jawaban", "danger");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>{quiz.title}</h2>
        <p><strong>Author:</strong> {quiz.authorName || "Unknown"}</p>

        <form>
          {quiz.questions.map((q, idx) => (
            <div className="mb-3" key={idx}>
              <p>{idx + 1}. {q.question}</p>
              {q.options.map((opt, oIdx) => (
                <div className="form-check" key={oIdx}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${idx}`}
                    value={opt}
                    checked={answers[idx] === opt}
                    onChange={() => handleChange(idx, opt)}
                  />
                  <label className="form-check-label">{opt}</label>
                </div>
              ))}
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit Jawaban</button>
        </form>
      </div>

      {/* Toast */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <div className={`toast align-items-center text-bg-${toastType} ${showToast ? "show" : "hide"}`} role="alert">
          <div className="d-flex">
            <div className="toast-body">{toastMessage}</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
          </div>
        </div>
      </div>
    </>
  );
}
