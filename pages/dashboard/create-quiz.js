import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/router";

export default function CreateQuiz() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: [], answer: "" } // awalnya kosong
  ]);

  // Tambah pertanyaan baru
  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: [], answer: "" }]);
  };

  // Hapus pertanyaan
  const removeQuestion = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions.splice(qIndex, 1);
    setQuestions(newQuestions);
  };

  // Update pertanyaan
  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].question = value;
    setQuestions(newQuestions);
  };

  // Tambah opsi jawaban
  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  // Hapus opsi jawaban
  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    // reset jawaban jika jawaban sebelumnya dihapus
    if (newQuestions[qIndex].answer === newQuestions[qIndex].options[oIndex]) {
      newQuestions[qIndex].answer = "";
    }
    setQuestions(newQuestions);
  };

  // Update opsi jawaban
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  // Update jawaban benar
  const handleAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answer = value;
    setQuestions(newQuestions);
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (!auth.currentUser) return alert("Login dulu!");
    if (!title.trim()) return alert("Judul quiz tidak boleh kosong!");
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return alert(`Pertanyaan ke-${i + 1} kosong!`);
      if (q.options.length < 2) return alert(`Pertanyaan ke-${i + 1} harus punya minimal 2 opsi!`);
      if (!q.answer) return alert(`Pertanyaan ke-${i + 1} belum ada jawaban benar!`);
    }
    try {
      await addDoc(collection(db, "quizzes"), {
        title,
        questions,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Anonymous",
        timestamp: Date.now()
      });
      alert("Quiz berhasil dibuat!");
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

        <div className="mb-3">
          <label className="form-label">Judul Quiz</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-4 border p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label">Pertanyaan {qIndex + 1}</label>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => removeQuestion(qIndex)}
              >
                Hapus Pertanyaan
              </button>
            </div>

            {/* Input pertanyaan */}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Masukkan pertanyaan"
              value={q.question}
              onChange={e => handleQuestionChange(qIndex, e.target.value)}
            />

            {/* Tampilkan opsi jawaban hanya jika pertanyaan sudah diisi */}
            {q.question.trim() !== "" && (
              <>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Opsi ${oIndex + 1}`}
                      value={opt}
                      onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeOption(qIndex, oIndex)}
                    >
                      Hapus
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-sm btn-secondary mb-2"
                  onClick={() => addOption(qIndex)}
                >
                  Tambah Opsi
                </button>

                {/* Dropdown jawaban benar hanya muncul jika ada opsi */}
                {q.options.length > 0 && (
                  <div className="mb-2">
                    <label className="form-label">Jawaban Benar</label>
                    <select
                      className="form-select"
                      value={q.answer}
                      onChange={e => handleAnswerChange(qIndex, e.target.value)}
                    >
                      <option value="">Pilih jawaban benar</option>
                      {q.options.map((opt, oIndex) => (
                        <option key={oIndex} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary me-2"
          onClick={addQuestion}
        >
          Tambah Pertanyaan
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleSubmit}
        >
          Buat Quiz
        </button>
      </div>
    </>
  );
}
