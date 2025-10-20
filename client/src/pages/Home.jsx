import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      {/* Nagłówek */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-6">
          <h1 className="text-3xl font-serif text-pink-600 font-bold">WeddingBuilder</h1>
          <nav className="space-x-4">
            <Link
              to="/login"
              className="text-pink-600 font-medium hover:underline"
            >
              Logowanie
            </Link>
            <Link
              to="/register"
              className="text-white bg-pink-400 px-4 py-2 rounded-lg shadow hover:bg-pink-500 transition"
            >
              Rejestracja
            </Link>
          </nav>
        </div>
      </header>

      {/* Sekcja Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-serif text-pink-600 mb-6">
          Stwórz swoją wymarzoną stronę weselną
        </h2>
        <p className="text-lg md:text-xl text-pink-500 mb-8 max-w-2xl">
          WeddingBuilder pozwala łatwo i szybko stworzyć spersonalizowaną stronę weselną. Dodawaj zdjęcia, menu, listę prezentów i więcej – wszystko w prostym kreatorze drag & drop.
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow hover:bg-pink-500 transition"
          >
            Zarejestruj się
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border-2 border-pink-400 text-pink-600 font-semibold rounded-lg hover:bg-pink-100 transition"
          >
            Zaloguj się
          </Link>
        </div>
      </section>

      {/* Stopka */}
      <footer className="bg-white shadow-inner mt-auto py-6 text-center text-pink-500">
        © 2025 WeddingBuilder. Wszystkie prawa zastrzeżone.
      </footer>
    </div>
  );
}
