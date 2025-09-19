import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import Navbar from "../../../components/Navbar";

export default function EditQuiz() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const quizRef = doc(db, "quizzes", id);
      const docSnap = await getDoc(quizRef);
      if (!docSnap.exists()) {
        alert("Quiz tidak ditemukan");
        router.push("/dashboard");
        return;
      }

      const data = docSnap.data();

      // Proteksi: hanya author yang bisa edit
      if (auth.currentUser.uid !== data.authorId) {
        alert("Anda tidak memiliki akses untuk mengedit quiz ini");
        router.push("/dashboard");
        return;
      }

      setTitle(data.title);
      setQuestions(data.questions || []);
      setIsPublished(data.isPublished || false);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil quiz");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correct = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", ""], correct: "" }]);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Judul quiz wajib diisi");

    try {
      const quizRef = doc(db, "quizzes", id);
      await updateDoc(quizRef, {
        title,
        questions,
        isPublished
      });
      alert("Quiz berhasil diperbarui!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui quiz");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Edit Quiz</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Judul Quiz</label>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-4 border p-3 rounded">
              <label className="form-label">Pertanyaan {qIndex + 1}</label>
              <input type="text" className="form-control mb-2" value={q.question} onChange={(e) => handleQuestionChange(qIndex, e.target.value)} required />

              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="mb-2 d-flex gap-2">
                  <input type="text" className="form-control" placeholder={`Opsi ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} required />
                </div>
              ))}

              <button type="button" className="btn btn-sm btn-secondary mb-2" onClick={() => addOption(qIndex)}>Tambah Opsi</button>

              <div className="mb-2">
                <label className="form-label">Jawaban Benar</label>
                <select className="form-select" value={q.correct} onChange={(e) => handleCorrectChange(qIndex, e.target.value)} required>
                  <option value="">Pilih jawaban benar</option>
                  {q.options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-outline-primary mb-3" onClick={addQuestion}>Tambah Pertanyaan</button>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} id="publishCheck" />
            <label className="form-check-label" htmlFor="publishCheck">Publikasikan Quiz</label>
          </div>

          <button type="submit" className="btn btn-success">Update Quiz</button>
        </form>
      </div>
    </>
  );
}
