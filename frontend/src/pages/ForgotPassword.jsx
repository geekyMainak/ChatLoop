import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../config";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const response = await axios.post(`${serverUrl}/api/auth/send-otp`, { email });
      setMsg(response.data.message);
      setStep(2);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setErr("Passwords do not match");
        return;
    }

    setLoading(true);
    setErr("");
    setMsg("");

    try {
      // Optional: Verify OTP first as requested in the API list, though reset-password also verifies it
      await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp });
      
      const response = await axios.put(`${serverUrl}/api/auth/reset-password`, { 
          email, 
          otp, 
          password 
      });
      setMsg(response.data.message);
      setTimeout(() => {
          navigate("/login");
      }, 2000);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="h-48 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 rounded-b-[60px] flex flex-col items-center justify-center shadow-lg px-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-pink-100 text-[15px]">
            {step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP and your new password"}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <input
                type="email"
                placeholder="Registered Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 p-4 outline-none transition-all duration-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
              />

              {err && <p className="text-red-500 text-sm">{"* " + err}</p>}
              {msg && <p className="text-green-500 text-sm">{"* " + msg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="bg-fuchsia-50 text-fuchsia-800 p-3 rounded-lg text-sm mb-4 text-center">
                OTP sent to <strong>{email}</strong>
              </div>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 p-4 outline-none transition-all duration-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 text-center tracking-[0.5em] font-bold text-lg"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 p-4 pr-12 outline-none transition-all duration-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-fuchsia-600 text-xl"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-300 p-4 pr-12 outline-none transition-all duration-300 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-fuchsia-600 text-xl"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {err && <p className="text-red-500 text-sm leading-tight">{"* " + err}</p>}
              {msg && <p className="text-green-500 text-sm font-medium">{"* " + msg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-fuchsia-600 hover:text-violet-700 font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
