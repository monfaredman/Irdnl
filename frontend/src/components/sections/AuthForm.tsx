"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AuthFormProps {
	mode: "login" | "register";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
	const router = useRouter();
	const { login, register, isLoading, error: authError } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [localError, setLocalError] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setStatus(null);
		setLocalError(null);

		if (mode === "register") {
			if (password !== confirmPassword) {
				setLocalError("رمز عبور و تکرار آن یکسان نیستند");
				return;
			}

			if (password.length < 8) {
				setLocalError("رمز عبور باید حداقل ۸ کاراکتر باشد");
				return;
			}

			setStatus("در حال ایجاد حساب کاربری…");
			const success = await register({ email, password, name });

			if (success) {
				setStatus("حساب کاربری ایجاد شد! در حال انتقال…");
				setTimeout(() => router.push("/"), 1500);
			}
		} else {
			setStatus("در حال ورود…");
			const success = await login({ email, password });

			if (success) {
				setStatus("خوش آمدید! در حال انتقال…");
				setTimeout(() => router.push("/"), 1500);
			}
		}
	};

	const displayError = localError || authError;

	return (
		<form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
			{mode === "register" && (
				<div>
					<label className="text-xs tracking-wide text-white/60">
						نام و نام خانوادگی
					</label>
					<input
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						minLength={2}
						className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-400 focus:outline-none"
						placeholder="مثال: علی محمدی"
					/>
				</div>
			)}

			<div>
				<label className="text-xs tracking-wide text-white/60">
					ایمیل
				</label>
				<input
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
					className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-400 focus:outline-none"
					placeholder="example@email.com"
					dir="ltr"
				/>
			</div>

			<div>
				<label className="text-xs tracking-wide text-white/60">
					رمز عبور
				</label>
				<input
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
					minLength={8}
					className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-400 focus:outline-none"
					placeholder="••••••••"
					dir="ltr"
				/>
			</div>

			{mode === "register" && (
				<div>
					<label className="text-xs tracking-wide text-white/60">
						تکرار رمز عبور
					</label>
					<input
						type="password"
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						required
						minLength={8}
						className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-amber-400 focus:outline-none"
						placeholder="••••••••"
						dir="ltr"
					/>
				</div>
			)}

			{displayError && (
				<p className="text-center text-sm text-red-400">{displayError}</p>
			)}

			<button
				className="w-full rounded-full bg-amber-500 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50 hover:bg-amber-400 transition-colors"
				type="submit"
				disabled={isLoading}
			>
				{isLoading
					? "لطفاً صبر کنید…"
					: mode === "register"
						? "ایجاد حساب کاربری"
						: "ورود"}
			</button>

			{/* Divider */}
			<div className="flex items-center gap-3">
				<div className="h-px flex-1 bg-white/10" />
				<span className="text-xs text-white/40">یا</span>
				<div className="h-px flex-1 bg-white/10" />
			</div>

			{/* Google Login Button */}
			<a
				href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/auth/google`}
				className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
			>
				<svg className="h-5 w-5" viewBox="0 0 24 24">
					<path
						fill="#4285F4"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
					/>
					<path
						fill="#34A853"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="#FBBC05"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/>
					<path
						fill="#EA4335"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/>
				</svg>
				{mode === "register" ? "ثبت‌نام با گوگل" : "ورود با گوگل"}
			</a>

			{status && !displayError && (
				<p className="text-center text-xs text-amber-400">{status}</p>
			)}

			<div className="text-center text-sm text-white/60">
				{mode === "login" ? (
					<>
						حساب کاربری ندارید؟{" "}
						<a href="/auth/register" className="text-amber-400 hover:underline">
							ثبت‌نام کنید
						</a>
					</>
				) : (
					<>
						قبلاً ثبت‌نام کرده‌اید؟{" "}
						<a href="/auth/login" className="text-amber-400 hover:underline">
							وارد شوید
						</a>
					</>
				)}
			</div>
		</form>
	);
};
