"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	Divider,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/api/auth";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
} from "@/theme/glass-design-system";

type AuthMode = "login" | "register" | "forgot-password" | "otp";

interface AuthModalsProps {
	open: boolean;
	onClose: () => void;
	initialMode?: AuthMode;
}

const translations = {
	en: {
		login: "Login",
		register: "Register",
		forgotPassword: "Forgot Password",
		email: "Email",
		phone: "Phone Number",
		password: "Password",
		confirmPassword: "Confirm Password",
		fullName: "Full Name",
		rememberMe: "Remember me",
		forgotPasswordLink: "Forgot password?",
		noAccount: "Don't have an account?",
		hasAccount: "Already have an account?",
		signUp: "Sign up",
		signIn: "Sign in",
		orContinueWith: "Or continue with",
		sendOTP: "Send OTP",
		verifyOTP: "Verify OTP",
		enterOTP: "Enter the code sent to your phone",
		resendOTP: "Resend code",
		resetPassword: "Reset Password",
		backToLogin: "Back to login",
		enterEmail: "Enter your email to reset password",
		sendResetLink: "Send Reset Link",
		resetLinkSent: "Reset link sent! Check your email.",
		loginSuccess: "Login successful!",
		registerSuccess: "Account created successfully!",
		invalidCredentials: "Invalid email or password",
		passwordMismatch: "Passwords do not match",
		google: "Google",
		apple: "Apple",
	},
	fa: {
		login: "ورود",
		register: "ثبت‌نام",
		forgotPassword: "فراموشی رمز عبور",
		email: "ایمیل",
		phone: "شماره موبایل",
		password: "رمز عبور",
		confirmPassword: "تأیید رمز عبور",
		fullName: "نام و نام خانوادگی",
		rememberMe: "مرا به خاطر بسپار",
		forgotPasswordLink: "رمز عبور را فراموش کرده‌اید؟",
		noAccount: "حساب کاربری ندارید؟",
		hasAccount: "قبلاً ثبت‌نام کرده‌اید؟",
		signUp: "ثبت‌نام",
		signIn: "ورود",
		orContinueWith: "یا ادامه با",
		sendOTP: "ارسال کد",
		verifyOTP: "تأیید کد",
		enterOTP: "کد ارسال شده به موبایل را وارد کنید",
		resendOTP: "ارسال مجدد کد",
		resetPassword: "بازیابی رمز عبور",
		backToLogin: "بازگشت به ورود",
		enterEmail: "ایمیل خود را برای بازیابی رمز عبور وارد کنید",
		sendResetLink: "ارسال لینک بازیابی",
		resetLinkSent: "لینک بازیابی ارسال شد! ایمیل خود را بررسی کنید.",
		loginSuccess: "ورود موفق!",
		registerSuccess: "حساب کاربری با موفقیت ایجاد شد!",
		invalidCredentials: "ایمیل یا رمز عبور اشتباه است",
		passwordMismatch: "رمز عبور و تأیید آن یکسان نیستند",
		google: "گوگل",
		apple: "اپل",
	},
};

export const AuthModals = ({
	open,
	onClose,
	initialMode = "login",
}: AuthModalsProps) => {
	const { language } = useLanguage();
	const isRTL = language === "fa";
	const t = translations[language] || translations.en;

	// Auth hook for real API calls
	const { login, register, isLoading: authLoading } = useAuth();

	const [mode, setMode] = useState<AuthMode>(initialMode);
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Form state
	const [formData, setFormData] = useState({
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		fullName: "",
		otp: "",
	});

	const handleInputChange = useCallback(
		(field: keyof typeof formData) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				setFormData((prev) => ({ ...prev, [field]: e.target.value }));
				setError(null);
			},
		[],
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			if (mode === "login") {
				// Real API login
				const success = await login({
					email: formData.email,
					password: formData.password,
				});

				if (success) {
					setSuccess(t.loginSuccess);
					setTimeout(() => {
						onClose();
						// Reset form
						setFormData({
							email: "",
							phone: "",
							password: "",
							confirmPassword: "",
							fullName: "",
							otp: "",
						});
					}, 1000);
				} else {
					setError(t.invalidCredentials);
				}
			} else if (mode === "register") {
				// Validate passwords match
				if (formData.password !== formData.confirmPassword) {
					setError(t.passwordMismatch);
					setLoading(false);
					return;
				}

				// Real API registration
				const success = await register({
					email: formData.email,
					password: formData.password,
					name: formData.fullName,
				});

				if (success) {
					setSuccess(t.registerSuccess);
					setTimeout(() => {
						onClose();
						// Reset form
						setFormData({
							email: "",
							phone: "",
							password: "",
							confirmPassword: "",
							fullName: "",
							otp: "",
						});
					}, 1000);
				} else {
					setError("Registration failed. Please try again.");
				}
			} else if (mode === "forgot-password") {
				// Real API password reset request
				await authApi.requestPasswordReset(formData.email);
				setSuccess(t.resetLinkSent);
			} else if (mode === "otp") {
				if (formData.otp.length === 6) {
					setSuccess(t.loginSuccess);
					setTimeout(() => onClose(), 1500);
				}
			}
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const glassInputSx = {
		"& .MuiOutlinedInput-root": {
			background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
			backdropFilter: `blur(${glassBlur.medium})`,
			borderRadius: glassBorderRadius.lg,
			color: glassColors.text.primary,
			transition: glassAnimations.transition.smooth,
			"& fieldset": {
				borderColor: glassColors.glass.border,
				transition: glassAnimations.transition.smooth,
			},
			"&:hover fieldset": {
				borderColor: `${glassColors.persianGold}60`,
			},
			"&.Mui-focused fieldset": {
				borderColor: glassColors.persianGold,
				boxShadow: `0 0 20px ${glassColors.gold.glow}`,
			},
		},
		"& .MuiInputLabel-root": {
			color: glassColors.text.tertiary,
			"&.Mui-focused": {
				color: glassColors.persianGold,
			},
		},
		"& .MuiInputAdornment-root svg": {
			color: glassColors.text.tertiary,
		},
	};

	const renderLoginForm = () => (
		<Box component="form" onSubmit={handleSubmit}>
			<TextField
				fullWidth
				label={t.email}
				type="email"
				value={formData.email}
				onChange={handleInputChange("email")}
				sx={{ ...glassInputSx, mb: 2 }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<EmailIcon />
						</InputAdornment>
					),
				}}
			/>

			<TextField
				fullWidth
				label={t.password}
				type={showPassword ? "text" : "password"}
				value={formData.password}
				onChange={handleInputChange("password")}
				sx={{ ...glassInputSx, mb: 1 }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<LockIcon />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() => setShowPassword(!showPassword)}
								edge="end"
								sx={{ color: glassColors.text.tertiary }}
							>
								{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
							</IconButton>
						</InputAdornment>
					),
				}}
			/>

			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					mb: 3,
				}}
			>
				<Button
					onClick={() => setMode("forgot-password")}
					sx={{
						color: glassColors.persianGold,
						fontSize: "0.8rem",
						textTransform: "none",
						"&:hover": {
							background: "transparent",
							textDecoration: "underline",
						},
					}}
				>
					{t.forgotPasswordLink}
				</Button>
			</Box>

			<Button
				type="submit"
				fullWidth
				disabled={loading}
				sx={{
					py: 1.5,
					borderRadius: glassBorderRadius.lg,
					background: `linear-gradient(135deg, ${glassColors.persianGold}, #D97706)`,
					color: glassColors.black,
					fontWeight: 700,
					fontSize: "1rem",
					textTransform: "none",
					transition: glassAnimations.transition.spring,
					"&:hover": {
						background: `linear-gradient(135deg, #FBBF24, ${glassColors.persianGold})`,
						transform: "translateY(-2px)",
						boxShadow: `0 8px 24px ${glassColors.gold.glow}`,
					},
					"&:disabled": {
						background: glassColors.glass.strong,
						color: glassColors.text.tertiary,
					},
				}}
			>
				{loading ? (
					<CircularProgress size={24} sx={{ color: glassColors.black }} />
				) : (
					t.login
				)}
			</Button>

			<Divider
				sx={{
					my: 3,
					"&::before, &::after": {
						borderColor: glassColors.glass.border,
					},
				}}
			>
				<Typography
					sx={{ color: glassColors.text.tertiary, fontSize: "0.8rem", px: 2 }}
				>
					{t.orContinueWith}
				</Typography>
			</Divider>

			<Box sx={{ display: "flex", gap: 2 }}>
				<Button
					fullWidth
					variant="outlined"
					startIcon={<GoogleIcon className="ml-2"/>}
				href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/auth/google`}
					sx={{
						py: 1.5,
						borderRadius: glassBorderRadius.lg,
						borderColor: glassColors.glass.border,
						color: glassColors.text.primary,
						textTransform: "none",
						"&:hover": {
							borderColor: glassColors.persianGold,
							background: glassColors.glass.base,
						},
					}}
				>
					{t.google}
				</Button>
			</Box>

			<Box sx={{ textAlign: "center", mt: 3 }}>
				<Typography
					component="span"
					sx={{ color: glassColors.text.tertiary, fontSize: "0.9rem" }}
				>
					{t.noAccount}{" "}
				</Typography>
				<Button
					onClick={() => setMode("register")}
					sx={{
						color: glassColors.persianGold,
						textTransform: "none",
						fontWeight: 600,
						"&:hover": {
							background: "transparent",
							textDecoration: "underline",
						},
					}}
				>
					{t.signUp}
				</Button>
			</Box>
		</Box>
	);

	const renderRegisterForm = () => (
		<Box component="form" onSubmit={handleSubmit}>
			<TextField
				fullWidth
				label={t.fullName}
				value={formData.fullName}
				onChange={handleInputChange("fullName")}
				sx={{ ...glassInputSx, mb: 2 }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<PersonIcon />
						</InputAdornment>
					),
				}}
			/>

			<TextField
				fullWidth
				label={t.email}
				type="email"
				value={formData.email}
				onChange={handleInputChange("email")}
				sx={{ ...glassInputSx, mb: 2 }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<EmailIcon />
						</InputAdornment>
					),
				}}
			/>

			<TextField
				fullWidth
				label={t.phone}
				value={formData.phone}
				onChange={handleInputChange("phone")}
				sx={{ ...glassInputSx, mb: 2 }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<PhoneIcon />
						</InputAdornment>
					),
				}}
				placeholder={isRTL ? "۰۹۱۲۳۴۵۶۷۸۹" : "09123456789"}
			/>

			<TextField
				fullWidth
				label={t.password}
				type={showPassword ? "text" : "password"}
				value={formData.password}
				onChange={handleInputChange("password")}
				sx={{ ...glassInputSx, mb: 2 }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<LockIcon />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() => setShowPassword(!showPassword)}
								edge="end"
								sx={{ color: glassColors.text.tertiary }}
							>
								{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
							</IconButton>
						</InputAdornment>
					),
				}}
			/>

			<TextField
				fullWidth
				label={t.confirmPassword}
				type={showPassword ? "text" : "password"}
				value={formData.confirmPassword}
				onChange={handleInputChange("confirmPassword")}
				sx={{ ...glassInputSx, mb: 3 }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<LockIcon />
						</InputAdornment>
					),
				}}
			/>

			<Button
				type="submit"
				fullWidth
				disabled={loading}
				sx={{
					py: 1.5,
					borderRadius: glassBorderRadius.lg,
					background: `linear-gradient(135deg, ${glassColors.persianGold}, #D97706)`,
					color: glassColors.black,
					fontWeight: 700,
					fontSize: "1rem",
					textTransform: "none",
					transition: glassAnimations.transition.spring,
					"&:hover": {
						background: `linear-gradient(135deg, #FBBF24, ${glassColors.persianGold})`,
						transform: "translateY(-2px)",
						boxShadow: `0 8px 24px ${glassColors.gold.glow}`,
					},
					"&:disabled": {
						background: glassColors.glass.strong,
						color: glassColors.text.tertiary,
					},
				}}
			>
				{loading ? (
					<CircularProgress size={24} sx={{ color: glassColors.black }} />
				) : (
					t.register
				)}
			</Button>

			<Box sx={{ textAlign: "center", mt: 3 }}>
				<Typography
					component="span"
					sx={{ color: glassColors.text.tertiary, fontSize: "0.9rem" }}
				>
					{t.hasAccount}{" "}
				</Typography>
				<Button
					onClick={() => setMode("login")}
					sx={{
						color: glassColors.persianGold,
						textTransform: "none",
						fontWeight: 600,
						"&:hover": {
							background: "transparent",
							textDecoration: "underline",
						},
					}}
				>
					{t.signIn}
				</Button>
			</Box>
		</Box>
	);

	const renderForgotPasswordForm = () => (
		<Box component="form" onSubmit={handleSubmit}>
			<Button
				startIcon={
					<ArrowBackIcon
						sx={{ transform: isRTL ? "rotate(180deg)" : "none" ,marginLeft:2}}
					/>
				}
				onClick={() => setMode("login")}
				sx={{
					color: glassColors.text.secondary,
					mb: 2,
					textTransform: "none",
					"&:hover": { background: "transparent" },
				}}
			>
				{t.backToLogin}
			</Button>

			<Typography
				sx={{
					color: glassColors.text.secondary,
					fontSize: "0.9rem",
					mb: 3,
					textAlign: "center",
				}}
			>
				{t.enterEmail}
			</Typography>

			<TextField
				fullWidth
				label={t.email}
				type="email"
				value={formData.email}
				onChange={handleInputChange("email")}
				sx={{ ...glassInputSx, mb: 3 }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<EmailIcon />
						</InputAdornment>
					),
				}}
			/>

			<Button
				type="submit"
				fullWidth
				disabled={loading}
				sx={{
					py: 1.5,
					borderRadius: glassBorderRadius.lg,
					background: `linear-gradient(135deg, ${glassColors.persianGold}, #D97706)`,
					color: glassColors.black,
					fontWeight: 700,
					fontSize: "1rem",
					textTransform: "none",
					transition: glassAnimations.transition.spring,
					"&:hover": {
						background: `linear-gradient(135deg, #FBBF24, ${glassColors.persianGold})`,
						transform: "translateY(-2px)",
						boxShadow: `0 8px 24px ${glassColors.gold.glow}`,
					},
					"&:disabled": {
						background: glassColors.glass.strong,
						color: glassColors.text.tertiary,
					},
				}}
			>
				{loading ? (
					<CircularProgress size={24} sx={{ color: glassColors.black }} />
				) : (
					t.sendResetLink
				)}
			</Button>
		</Box>
	);

	const renderOTPForm = () => (
		<Box component="form" onSubmit={handleSubmit}>
			<Button
				startIcon={
					<ArrowBackIcon
						sx={{ transform: isRTL ? "rotate(180deg)" : "none" ,marginLeft:2}}
					/>
				}
				onClick={() => setMode("login")}
				sx={{
					color: glassColors.text.secondary,
					mb: 2,
					textTransform: "none",
					"&:hover": { background: "transparent" },
				}}
			>
				{t.backToLogin}
			</Button>

			<Typography
				sx={{
					color: glassColors.text.secondary,
					fontSize: "0.9rem",
					mb: 3,
					textAlign: "center",
				}}
			>
				{t.enterOTP}
			</Typography>

			<Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 3 }}>
				{[0, 1, 2, 3, 4, 5].map((index) => (
					<TextField
						key={index}
						inputProps={{
							maxLength: 1,
							style: {
								textAlign: "center",
								fontSize: "1.5rem",
								fontWeight: 700,
							},
						}}
						sx={{
							width: 50,
							...glassInputSx,
							"& .MuiOutlinedInput-root": {
								...glassInputSx["& .MuiOutlinedInput-root"],
								height: 60,
							},
						}}
					/>
				))}
			</Box>

			<Button
				type="submit"
				fullWidth
				disabled={loading}
				sx={{
					py: 1.5,
					borderRadius: glassBorderRadius.lg,
					background: `linear-gradient(135deg, ${glassColors.persianGold}, #D97706)`,
					color: glassColors.black,
					fontWeight: 700,
					fontSize: "1rem",
					textTransform: "none",
					mb: 2,
					"&:hover": {
						background: `linear-gradient(135deg, #FBBF24, ${glassColors.persianGold})`,
						transform: "translateY(-2px)",
						boxShadow: `0 8px 24px ${glassColors.gold.glow}`,
					},
				}}
			>
				{loading ? (
					<CircularProgress size={24} sx={{ color: glassColors.black }} />
				) : (
					t.verifyOTP
				)}
			</Button>

			<Button
				fullWidth
				sx={{
					color: glassColors.text.tertiary,
					textTransform: "none",
					"&:hover": { color: glassColors.persianGold },
				}}
			>
				{t.resendOTP}
			</Button>
		</Box>
	);

	const getTitle = () => {
		switch (mode) {
			case "login":
				return t.login;
			case "register":
				return t.register;
			case "forgot-password":
				return t.forgotPassword;
			case "otp":
				return t.verifyOTP;
			default:
				return t.login;
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="xs"
			fullWidth
			PaperProps={{
				sx: {
					background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.deepMidnight})`,
					backdropFilter: `blur(40px) saturate(180%)`,
					WebkitBackdropFilter: `blur(40px) saturate(180%)`,
					border: `1px solid ${glassColors.glass.border}`,
					borderRadius: glassBorderRadius.xl,
					boxShadow: `0 32px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
					overflow: "hidden",
				},
			}}
			sx={{
				"& .MuiBackdrop-root": {
					backgroundColor: "rgba(0, 0, 0, 0.8)",
					backdropFilter: "blur(8px)",
				},
			}}
		>
			{/* Close Button */}
			<IconButton
				onClick={onClose}
				sx={{
					position: "absolute",
					top: 12,
					[isRTL ? "left" : "right"]: 12,
					color: glassColors.text.tertiary,
					zIndex: 10,
					"&:hover": { color: glassColors.text.primary },
				}}
			>
				<CloseIcon />
			</IconButton>

			<DialogContent
				sx={{
					p: 4,
					direction: isRTL ? "rtl" : "ltr",
				}}
			>
				{/* Logo */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						mb: 3,
					}}
				>
					<Box
						sx={{
							width: 60,
							height: 60,
							borderRadius: glassBorderRadius.lg,
							background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
							border: `1px solid ${glassColors.persianGold}60`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: `0 8px 24px ${glassColors.gold.glow}`,
						}}
					>
						<Typography
							sx={{
								fontWeight: 800,
								fontSize: "1.5rem",
								color: glassColors.persianGold,
							}}
						>
							Ir
						</Typography>
					</Box>
				</Box>

				{/* Title */}
				<Typography
					variant="h5"
					sx={{
						fontWeight: 700,
						color: glassColors.text.primary,
						textAlign: "center",
						mb: 3,
					}}
				>
					{getTitle()}
				</Typography>

				{/* Alerts */}
				{error && (
					<Alert
						severity="error"
						sx={{
							mb: 2,
							background: "rgba(239, 68, 68, 0.1)",
							border: "1px solid rgba(239, 68, 68, 0.3)",
							color: "#EF4444",
							borderRadius: glassBorderRadius.md,
						}}
					>
						{error}
					</Alert>
				)}

				{success && (
					<Alert
						severity="success"
						sx={{
							mb: 2,
							background: "rgba(34, 197, 94, 0.1)",
							border: "1px solid rgba(34, 197, 94, 0.3)",
							color: "#22C55E",
							borderRadius: glassBorderRadius.md,
						}}
					>
						{success}
					</Alert>
				)}

				{/* Form Content */}
				{mode === "login" && renderLoginForm()}
				{mode === "register" && renderRegisterForm()}
				{mode === "forgot-password" && renderForgotPasswordForm()}
				{mode === "otp" && renderOTPForm()}
			</DialogContent>
		</Dialog>
	);
};

export default AuthModals;
