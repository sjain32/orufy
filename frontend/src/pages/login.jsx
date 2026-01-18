import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPInput from "../components/otp.jsx";
import { requestOtp, verifyOtp } from "../api/authApi.js";
import loginIllustration from "../assets/Frame 2.png";
import logoImage from "../assets/Frame 4.png";

function Login() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (step !== "otp" || canResend) return;
    const i = setInterval(() => {
      setTimer((t) => (t === 1 ? (setCanResend(true), 0) : t - 1));
    }, 1000);
    return () => clearInterval(i);
  }, [step, canResend]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await requestOtp(email);
      setStep("otp");
      setTimer(60);
      setCanResend(false);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp(email, otp);
      if (!res?.token) throw new Error();

      localStorage.setItem("token", res.token);

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 0);
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:block bg-[#eef0f8]">
          <img
            src={loginIllustration}
            alt="Login illustration"
            className="h-full w-full object-cover"
          />
         
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden mb-8">
            <img
              src={logoImage}
              alt="Productr logo"
              className="h-8 w-auto"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 text-center">
            {step === "email"
              ? "Login to your Productr Account"
              : "Verify OTP"}
          </h1>
          <p className="text-sm text-gray-500 text-center mt-2">
            {step === "email"
              ? "Enter your email to continue"
              : "Enter the OTP sent to your email"}
          </p>

          {error && (
            <p className="text-red-600 text-center mt-4">{error}</p>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="mt-8 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A1B63] text-white py-2.5 rounded-lg font-semibold disabled:opacity-60"
              >
                {loading ? "Sending..." : "Login"}
              </button>
            </form>
          ) : (
            <div className="mt-8 space-y-4">
              <OTPInput onChangeOTP={setOtp} />
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-[#0A1B63] text-white py-2.5 rounded-lg font-semibold disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <p className="text-center text-sm text-gray-500">
                {canResend ? "Resend OTP" : `Resend in ${timer}s`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
