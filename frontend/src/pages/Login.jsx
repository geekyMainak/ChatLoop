import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../config";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false)
  let dispatch = useDispatch()


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data))
      setEmail("")
      setPassword("")
      setLoading(false)
    } catch (error) {
      console.log(error.response?.data || error.message);
      setLoading(false)
      setErr(error.response.data.message)
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="h-56 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 rounded-b-[60px] flex flex-col items-center justify-center shadow-lg">
          <img
            src="/logo.png"
            alt="ChatLoop Logo"
            className="w-20 h-20 mb-3"
          />

          <h1 className="text-4xl font-bold">
            <span className="text-gray-900">Welcome Back </span>
            <span className="text-white">ChatLoop</span>
          </h1>

          <p className="text-pink-100 mt-3 text-lg">
            Login to continue chatting
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

            <input
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-4 outline-none transition-all duration-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-4 pr-20 outline-none transition-all duration-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-fuchsia-600 text-xl"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-fuchsia-600 hover:text-violet-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {err && <p className="text-red-500">{"*" + err}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 text-white py-4 rounded-xl font-semibold text-lg disabled={loading}"
            >
              {loading ? "Loading..." : "Login"}
            </button>

          </form>

          <p className="text-center mt-8 text-gray-500">
            Don't have an account?
            <Link
              to="/signup"
              className="ml-2 font-semibold text-fuchsia-600 hover:text-violet-700"
            >
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;