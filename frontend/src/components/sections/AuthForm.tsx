"use client";

import { FormEvent, useState } from "react";
import { sendOtp, sendTransactionalEmail } from "@/lib/integrations";

interface AuthFormProps {
  mode: "login" | "register";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("+989121234567");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Sending secure link…");
    if (mode === "register") {
      await sendTransactionalEmail({
        to: email,
        subject: "Welcome to irdnl",
        html: "<p>Confirm your account</p>",
      });
    } else {
      await sendOtp({ phone, message: "Your irdnl OTP is 493201" });
    }
    setStatus("Check your inbox or phone to continue");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-wide text-white/60">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-white/60">Phone (for OTP)</label>
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white"
        />
      </div>
      <button className="w-full rounded-full bg-emerald-400 py-3 text-sm font-semibold text-black" type="submit">
        {mode === "register" ? "Create account" : "Send login code"}
      </button>
      {status && <p className="text-center text-xs text-white/60">{status}</p>}
    </form>
  );
};
