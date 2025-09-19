import Layout from "../components/Layout";
import Link from "next/link";

export default function Petunjuk() {
  return (
    <>
            <Layout title="FAQ | Pertanyaan yang sering di tanyakan" description="Buat dan jawab quiz publik dengan user lain">
   
      <div className="container mt-5 mb-5">
        <h2>Petunjuk Penggunaan</h2>
        <hr />

        <div className="accordion" id="petunjukAccordion">

          {/* Registrasi & Login */}
          <div className="accordion-item border-primary mb-2">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                <i className="bi bi-person-plus me-2"></i> Registrasi & Login
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#petunjukAccordion">
              <div className="accordion-body bg-primary bg-opacity-10">
                Daftar terlebih dahulu untuk membuat quiz atau menjawab quiz yang tersedia. Gunakan menu <Link href="/register">Register</Link> atau <Link href="/login">Login</Link>.
              </div>
            </div>
          </div>

          {/* Membuat Quiz */}
          <div className="accordion-item border-success mb-2">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                <i className="bi bi-pencil-square me-2"></i> Membuat Quiz
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#petunjukAccordion">
              <div className="accordion-body bg-success bg-opacity-10">
                Setelah login, masuk ke <Link href="/dashboard">Dashboard</Link> dan klik "Buat Quiz Baru". Tambahkan pertanyaan dan jawaban.  
                Jika sudah selesai, klik tombol <span className="badge bg-success">Publikasikan</span> agar quiz bisa dijawab user lain.
              </div>
            </div>
          </div>

          {/* Menjawab Quiz */}
          <div className="accordion-item border-info mb-2">
            <h2 className="accordion-header" id="headingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                <i className="bi bi-check-circle me-2"></i> Menjawab Quiz
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#petunjukAccordion">
              <div className="accordion-body bg-info bg-opacity-10">
                Pergi ke halaman <Link href="/">Kuisi Publik</Link>. Pilih quiz yang ingin dijawab dan klik. Jawaban akan disimpan dan skor akan muncul di leaderboard.
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="accordion-item border-warning mb-2">
            <h2 className="accordion-header" id="headingFour">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                <i className="bi bi-trophy me-2"></i> Leaderboard
              </button>
            </h2>
            <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#petunjukAccordion">
              <div className="accordion-body bg-warning bg-opacity-10">
                Setiap quiz yang dipublikasikan memiliki leaderboard untuk melihat peringkat user berdasarkan skor tertinggi.
              </div>
            </div>
          </div>

          {/* Profil */}
          <div className="accordion-item border-secondary mb-2">
            <h2 className="accordion-header" id="headingFive">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive">
                <i className="bi bi-person-badge me-2"></i> Profil
              </button>
            </h2>
            <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#petunjukAccordion">
              <div className="accordion-body bg-secondary bg-opacity-10">
                Klik tombol <Link href="/dashboard/profile">Profile</Link> untuk melihat quiz yang sudah dibuat, quiz yang sudah dijawab, dan mengedit data diri seperti nama, email, atau reset password.
              </div>
            </div>
          </div>

          {/* Reset Password */}
          <div className="accordion-item border-danger mb-2">
            <h2 className="accordion-header" id="headingSix">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix">
                <i className="bi bi-key me-2"></i> Reset Password
              </button>
            </h2>
            <div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#petunjukAccordion">
              <div className="accordion-body bg-danger bg-opacity-10">
                Jika lupa password, klik link <span className="text-primary">Reset Password</span> di halaman login. Password baru akan dikirim ke email.
              </div>
            </div>
          </div>

          

        </div>

        <div className="mt-4">
          <Link href="/" className="btn btn-primary">Kembali ke Halaman Utama</Link>
        </div>
      </div>
 </Layout>
    </>
  );
}
