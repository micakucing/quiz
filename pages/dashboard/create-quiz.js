import { useState } from "react";
import { useRouter } from "next/router";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Navbar from "../../components/Navbar";

export default function CreateQuiz() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isPublished, setIsPublished] = useState(false);

  const addQuestion = () => setQuestions([...questions, { question: "", options: ["", ""], correct: "" }]);
  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Judul quiz wajib diisi");
    try {
      await addDoc(collection(db, "quizzes"), {
        title,
        questions,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Anonymous",
        isPublished
      });
      alert(isPublished ? "Quiz berhasil dipublikasikan" : "Quiz disimpan sebagai draft");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Gagal membuat quiz");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>Buat Quiz Baru</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Judul Quiz</label>
            <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-4 border p-3 rounded">
              <label className="form-label">Pertanyaan {qIndex + 1}</label>
              <input type="text" className="form-control mb-2" value={q.question} onChange={e => handleQuestionChange(qIndex, e.target.value)} required />

              {q.options.map((opt, oIndex) => (
                <input key={oIndex} type="text" className="form-control mb-2" placeholder={`Opsi ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} required />
              ))}

              <button type="button" className="btn btn-sm btn-secondary mb-2" onClick={() => addOption(qIndex)}>Tambah Opsi</button>

              <select className="form-select" value={q.correct} onChange={e => handleCorrectChange(qIndex, e.target.value)} required>
                <option value="">Pilih jawaban benar</option>
                {q.options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
              </select>
            </div>
          ))}

          <button type="button" className="btn btn-outline-primary mb-3" onClick={addQuestion}>Tambah Pertanyaan</button>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} id="publishCheck" />
            <label className="form-check-label" htmlFor="publishCheck">Publikasikan Quiz</label>
          </div>

          <button type="submit" className="btn btn-success">Simpan Quiz</button>
        </form>
      </div>
    </>
  );
}
