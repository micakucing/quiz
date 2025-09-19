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
  const [authorFilter, setAuthorFilter] = useState(""); // filter by author
  const [authors, setAuthors] = useState([]); // list author unik
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 5;

  useEffect(() => {
    fetchPublicQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [searchTerm, authorFilter, publicQuizzes]);

  const fetchPublicQuizzes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "quizzes"), where("isPublished", "==", true));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPublicQuizzes(data);
      setFilteredQuizzes(data);

      // ambil list author unik
      const uniqueAuthors = Array.from(new Set(data.map(q => q.authorName))).sort();
      setAuthors(uniqueAuthors);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuizzes = () => {
    let filtered = publicQuizzes;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(term) ||
        q.authorName.toLowerCase().includes(term)
      );
    }

    if (authorFilter) {
      filtered = filtered.filter(q => q.authorName === authorFilter);
    }

    setFilteredQuizzes(filtered);
    setCurrentPage(1); // reset ke page 1 saat filter/search
  };

  // Pagination calculation
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
  const showPagination = filteredQuizzes.length > 10;

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      <LoadingOverlay show={loading} />

      <div className="container mt-5 mb-5">
        <h2>Kuisi Publik</h2>

       <div className="mb-3 mt-3">
  <div className="input-group">
    {/* Input Search */}
    <input
      type="text"
      className="form-control"
      placeholder="Cari quiz berdasarkan judul atau pembuat..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />

    {/* Filter by Author */}
    <select
      className="form-select"
      value={authorFilter}
      onChange={e => setAuthorFilter(e.target.value)}
    >
      <option value="">Filter pembuat</option>
      {authors.map((a, i) => (
        <option key={i} value={a}>{a}</option>
      ))}
    </select>

    {/* Reset Filter/Search Button */}
    <button
      className="btn btn-outline-secondary"
      onClick={() => { setSearchTerm(""); setAuthorFilter(""); }}
    >
      Reset
    </button>
  </div>
</div>
        {currentQuizzes.length === 0 && !loading ? (
          <p>Tidak ada quiz yang sesuai</p>
        ) : (
          <div className="list-group">
            {currentQuizzes.map(q => (
              <Link key={q.id} href={`/quiz/${q.id}`} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                <span>{q.title} - <small>oleh {q.authorName}</small></span>
                {q.isPublished && <span className="badge bg-success">Sudah Publik</span>}
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <footer className="bg-light text-center py-3">
        @ramahardian.my.id
      </footer>
    </>
  );
}
