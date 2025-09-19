import Head from "next/head";
import Navbar from "./Navbar";
import LoadingOverlay from "./Loadding";

export default function Layout({ children, title = "Kuisi", description = "Platform quiz publik, buat dan jawab quiz online.", loading = false }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="Kuisi, online quiz, publik quiz, membuat quiz, jawaban quiz" />
        <meta name="author" content="Rama Hardian" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://kuisi.vercel.app/" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>

      <Navbar />
      <LoadingOverlay show={loading} />

      <main className="container mt-5 mb-5">{children}</main>

      <footer className="bg-light text-center py-3">
        Kuisi@2025 ramahardian.my.id
      </footer>
    </>
  );
}
