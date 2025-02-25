import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Sending OTP...</span>
                </div>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Enter OTP</Label>
              <div className="flex justify-between gap-2">
                {otp &&
                  otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      inputMode="numeric"
                      className="w-14 h-14 text-center text-2xl"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      required
                    />
                  ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  placeholder="New password goes here"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  className="pl-10"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Resetting password...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        );
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Forgot Password";
      case 2:
        return "Verify OTP";
      case 3:
        return "Reset Password";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "Enter your email to receive an OTP";
      case 2:
        return "Enter the 4-digit code sent to your email";
      case 3:
        return "Create a new password for your account";
    }
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] w-full py-12 md:py-24 bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">
            {getStepTitle()}
          </h1>
          <p className="text-muted-foreground">{getStepDescription()}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              {getStepTitle()}
            </CardTitle>
            <CardDescription>{getStepDescription()}</CardDescription>
          </CardHeader>

          <CardContent>
            {renderStep()}

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Remember your password?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
