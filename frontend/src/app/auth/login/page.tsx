import type { Metadata } from "next";
import { AuthForm } from "@/components/sections/AuthForm";

export const metadata: Metadata = {
	title: "Login | irdnl",
	description: "Secure OTP login for irdnl accounts.",
};

export default function LoginPage() {
	return (
		<div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">
			<header>
				<p className="text-xs uppercase tracking-[0.4em] text-white/60">
					Access
				</p>
				<h1 className="text-3xl font-semibold text-white">Login</h1>
				<p className="text-sm text-white/70">
					Use your email or OTP-enabled phone to continue watching.
				</p>
			</header>
			<AuthForm mode="login" />
		</div>
	);
}
