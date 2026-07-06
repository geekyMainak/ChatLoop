import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../config";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErr("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          userName,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data.user));

      setName("");
      setUserName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error.response?.data);

      setErr(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="h-56 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 rounded-b-[60px] flex flex-col items-center justify-center shadow-lg">

          <img
            src="/logo.png"
            alt="ChatLoop"
            className="w-20 h-20 mb-3"
          />

          <h1 className="text-4xl font-bold">
            <span className="text-gray-900">
              Welcome to
            </span>{" "}
            <span className="text-white">
              ChatLoop
            </span>
          </h1>

          <p className="text-pink-100 mt-3 text-lg">
            Connect. Chat. Repeat.
          </p>

        </div>

        {/* Form */}

        <div className="p-8">

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Create Account
          </h2>

          <form
            onSubmit={handleSignUp}
            className="space-y-5"
          >

            {/* Name */}

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 p-4 outline-none transition-all duration-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
            />

            {/* Username */}

            <input
              type="text"
              placeholder="Username"
              autoComplete="username"
              value={userName}
              onChange={(e) =>
                setUserName(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 p-4 outline-none transition-all duration-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
            />

            {/* Email */}

            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border border-gray-300 p-4 outline-none transition-all duration-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
            />

            {/* Password */}

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 p-4 pr-16 outline-none transition-all duration-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-fuchsia-600 text-xl"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

            {err && (
              <p className="text-red-500 text-sm">
                * {err}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>

          </form>

          <p className="text-center mt-8 text-gray-500">

            Already have an account?

            <Link
              to="/login"
              className="ml-2 font-semibold text-fuchsia-600 hover:text-violet-700"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default SignUp;