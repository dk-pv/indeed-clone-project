import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import useAlert from "../hooks/useAlert";
import AlertMessage from "../components/common/AlertMessage";

const SingleEntryAuth = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Resend OTP states
  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);

  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { alert, showAlert, hideAlert } = useAlert();

  // Cooldown timer effect
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const isEmail = (input) => /\S+@\S+\.\S+/.test(input);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!isEmail(email)) {
        setError("Enter a valid email address");
        return;
      }

      const role = localStorage.getItem("userRole");

      const res = await axios.post("http://localhost:9999/api/auth/send-otp", {
        email,
        role,
      });

      setOtpSent(true);
      setCanResend(false);
      setResendCooldown(60); // 60 seconds cooldown
      showAlert("success", "OTP sent to your email");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP");
      showAlert("error", err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || resendLoading) return;

    setResendLoading(true);
    setError("");

    try {
      const role = localStorage.getItem("userRole");

      const res = await axios.post("http://localhost:9999/api/auth/send-otp", {
        email,
        role,
      });

      setCanResend(false);
      setResendCooldown(60); // Reset cooldown to 60 seconds
      setOtp(new Array(6).fill("")); // Clear previous OTP

      // Clear OTP input fields
      otpRefs.current.forEach((ref) => {
        if (ref) ref.value = "";
      });

      showAlert("success", "New OTP sent to your email");
    } catch (err) {
      console.error(err);
      setError("Failed to resend OTP");
      showAlert(
        "error",
        err?.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:9999/api/auth/verify-otp",
        {
          email,
          otp: otp.join(""),
        }
      );

      const { token, user } = res.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("userRole");

        showAlert("success", "OTP Verified. Logged in!");
        setTimeout(() => navigate("/" , {replace : true}), 1000);
      } else {
        setError("Invalid response from server");
        showAlert("error", "Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid OTP or server error");
      showAlert(
        "error",
        err?.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        otpRefs.current[index - 1].focus();
      }
      setOtp(newOtp);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const role = localStorage.getItem("userRole");
      const token = credentialResponse?.credential;

      if (!token) {
        showAlert("error", "Google token missing");
        return;
      }

      const res = await axios.post(
        "http://localhost:9999/api/auth/google-login",
        {
          token,
          role,
        }
      );

      const { token: jwtToken, user } = res.data;

      if (jwtToken && user) {
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("userRole");

        showAlert("success", "Google login successful");
        setTimeout(() => navigate("/" , {replace : true}), 1000);
      } else {
        showAlert("error", "Invalid response from server");
      }
    } catch (err) {
      console.error(err?.response?.data || err.message);
      showAlert("error", "Google login failed");
    }
  };

  const handleGoogleError = () => {
    showAlert("error", "Google login failed");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-2 border-gray-300 p-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <Link to="/">
            <img
              src="https://1000logos.net/wp-content/uploads/2023/01/Indeed-logo-500x281.jpg"
              alt="Indeed"
              className="h-10 mx-auto"
            />
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Ready to take the next step?
          </h2>
          <p className="text-gray-700 text-lg">Sign in or create an account.</p>
        </div>

        {/* Terms Agreement */}
        <div className="text-sm text-gray-600 mb-8 p-4 bg-gray-50 rounded-md border border-gray-200 leading-relaxed">
          By continuing, you agree to Indeed's{" "}
          <Link
            to="/terms"
            className="text-blue-700 hover:underline font-medium"
          >
            Terms
          </Link>
          ,{" "}
          <Link
            to="/cookie-policy"
            className="text-blue-700 hover:underline font-medium"
          >
            Cookie
          </Link>
          , and{" "}
          <Link
            to="/privacy-policy"
            className="text-blue-700 hover:underline font-medium"
          >
            Privacy
          </Link>{" "}
          policies.
        </div>

        {/* Alert Message */}
        {alert && (
          <div className="mb-6">
            <AlertMessage
              type={alert.type}
              message={alert.message}
              onClose={hideAlert}
            />
          </div>
        )}

        {/* Google Login Section */}
        <div className="mb-8 flex justify-center">
          <div className="border-2 border-gray-300 rounded-lg p-2 hover:border-gray-400 transition-colors">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-base">
            <span className="px-4 bg-white text-gray-600 font-medium">or</span>
          </div>
        </div>

        {/* Email Form */}
        {!otpSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-base font-semibold text-gray-900 mb-3"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-4 text-lg border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
              />
              {error && (
                <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:border-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Continue with Email"}
            </button>
          </form>
        ) : (
          // OTP Verification Form
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-base font-semibold text-gray-900 mb-4"
              >
                Enter OTP
              </label>
              <div
                className="flex justify-between gap-3"
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData("text").slice(0, 6);
                  const newOtp = [...otp];
                  [...pasted].forEach((char, i) => {
                    newOtp[i] = char;
                    otpRefs.current[i].value = char;
                  });
                  setOtp(newOtp);
                  otpRefs.current[Math.min(pasted.length, 5)]?.focus();
                }}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    ref={(el) => (otpRefs.current[index] = el)}
                    className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-500"
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-3 font-medium">{error}</p>
              )}

              {/* Resend OTP Section */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || resendLoading}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {resendLoading
                    ? "Sending..."
                    : canResend
                    ? "Resend OTP"
                    : `Resend in ${resendCooldown}s`}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg text-lg font-semibold border-2 border-green-600 hover:border-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SingleEntryAuth;
