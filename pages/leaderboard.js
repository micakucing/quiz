import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Layout from "../components/Layout";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Ambil 10 user dengan skor tertinggi
      const q = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
      const snap = await getDocs(q);
      const leaderboard = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(leaderboard);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading leaderboard...</p>;

  return (
    <>
            <Layout title="Kuisi Publik | Peringkat Terbaik" description="Peringkat penjawab pertanyaan terbaik" loading={loading}>

      <div className="container mt-5">
        <h2>Leaderboard Quiz</h2>
        {users.length === 0 ? (
          <p>Belum ada user yang menyelesaikan quiz.</p>
        ) : (
          <table className="table table-striped table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Nama User</th>
                <th>Email</th>
                <th>Total Skor</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.score || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </Layout>
    </>
  );
}
