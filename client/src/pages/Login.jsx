import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-lg border border-pink-100">
        <h2 className="text-3xl font-serif mb-6 text-center text-pink-600">Logowanie</h2>
        <form className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-400"
          />
          <input
            type="password"
            placeholder="Hasło"
            className="w-full p-4 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-400"
          />
          <button
            type="submit"
            className="w-full py-3 bg-pink-200 text-pink-800 font-semibold rounded-xl shadow hover:bg-pink-300 transition"
          >
            Zaloguj się
          </button>
        </form>
        <p className="mt-6 text-center text-pink-500">
          Nie masz konta?{" "}
          <Link to="/register" className="underline font-medium hover:text-pink-600">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}
