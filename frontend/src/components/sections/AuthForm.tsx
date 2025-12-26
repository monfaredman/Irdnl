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
			// Validate passwords match
			if (password !== confirmPassword) {
				setLocalError("Passwords do not match");
				return;
			}

			// Validate password length
			if (password.length < 8) {
				setLocalError("Password must be at least 8 characters");
				return;
			}

			setStatus("Creating your account…");
			const success = await register({ email, password, name });

			if (success) {
				setStatus("Account created! Redirecting…");
				setTimeout(() => router.push("/"), 1500);
			}
		} else {
			setStatus("Signing in…");
			const success = await login({ email, password });

			if (success) {
				setStatus("Welcome back! Redirecting…");
				setTimeout(() => router.push("/"), 1500);
			}
		}
	};

	const displayError = localError || authError;

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{mode === "register" && (
				<div>
					<label className="text-xs uppercase tracking-wide text-white/60">
						Full Name
					</label>
					<input
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						minLength={2}
						className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
						placeholder="John Doe"
					/>
				</div>
			)}

			<div>
				<label className="text-xs uppercase tracking-wide text-white/60">
					Email
				</label>
				<input
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
					className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label className="text-xs uppercase tracking-wide text-white/60">
					Password
				</label>
				<input
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
					minLength={8}
					className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
					placeholder="••••••••"
				/>
			</div>

			{mode === "register" && (
				<div>
					<label className="text-xs uppercase tracking-wide text-white/60">
						Confirm Password
					</label>
					<input
						type="password"
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						required
						minLength={8}
						className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
						placeholder="••••••••"
					/>
				</div>
			)}

			{displayError && (
				<p className="text-center text-sm text-red-400">{displayError}</p>
			)}

			<button
				className="w-full rounded-full bg-emerald-400 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
				type="submit"
				disabled={isLoading}
			>
				{isLoading
					? "Please wait…"
					: mode === "register"
						? "Create account"
						: "Sign in"}
			</button>

			{status && !displayError && (
				<p className="text-center text-xs text-emerald-400">{status}</p>
			)}

			<div className="text-center text-sm text-white/60">
				{mode === "login" ? (
					<>
						Don&apos;t have an account?{" "}
						<a href="/auth/register" className="text-emerald-400 hover:underline">
							Sign up
						</a>
					</>
				) : (
					<>
						Already have an account?{" "}
						<a href="/auth/login" className="text-emerald-400 hover:underline">
							Sign in
						</a>
					</>
				)}
			</div>
		</form>
	);
};
