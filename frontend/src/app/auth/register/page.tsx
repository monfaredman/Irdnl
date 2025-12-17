import type { Metadata } from "next";
import { AuthForm } from "@/components/sections/AuthForm";

export const metadata: Metadata = {
	title: "Register | irdnl",
	description: "Create a irdnl account with secure email verification.",
};

export default function RegisterPage() {
	return (
		<div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">
			<header>
				<p className="text-xs uppercase tracking-[0.4em] text-white/60">Join</p>
				<h1 className="text-3xl font-semibold text-white">Create Account</h1>
				<p className="text-sm text-white/70">
					Register to sync profiles, watch history, and device preferences.
				</p>
			</header>
			<AuthForm mode="register" />
		</div>
	);
}
