"use client";

import {
	Close,
	ContentCopy,
	Facebook,
	LinkedIn,
	Share,
	Telegram,
	Twitter,
	WhatsApp,
} from "@mui/icons-material";
import {
	Box,
	Dialog,
	DialogContent,
	IconButton,
	TextField,
	Typography,
	Snackbar,
	Alert,
} from "@mui/material";
import { useState } from "react";
import {
	glassAnimations,
	glassBlur,
	glassBorderRadius,
	glassColors,
	glassSpacing,
} from "@/theme/glass-design-system";

interface ShareDialogProps {
	open: boolean;
	onClose: () => void;
	title: string;
	url?: string;
}

const socialPlatforms = [
	{
		id: "twitter",
		name: "Twitter",
		icon: Twitter,
		color: "#1DA1F2",
		getShareUrl: (url: string, title: string) =>
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
	},
	{
		id: "facebook",
		name: "Facebook",
		icon: Facebook,
		color: "#1877F2",
		getShareUrl: (url: string) =>
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
	},
	{
		id: "whatsapp",
		name: "WhatsApp",
		icon: WhatsApp,
		color: "#25D366",
		getShareUrl: (url: string, title: string) =>
			`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
	},
	{
		id: "telegram",
		name: "Telegram",
		icon: Telegram,
		color: "#0088cc",
		getShareUrl: (url: string, title: string) =>
			`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
	},
	{
		id: "linkedin",
		name: "LinkedIn",
		icon: LinkedIn,
		color: "#0A66C2",
		getShareUrl: (url: string) =>
			`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
	},
];

export const ShareDialog = ({
	open,
	onClose,
	title,
	url,
}: ShareDialogProps) => {
	const [showCopySuccess, setShowCopySuccess] = useState(false);
	const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setShowCopySuccess(true);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	const handleSocialShare = (platform: typeof socialPlatforms[0]) => {
		const shareLink = platform.getShareUrl(shareUrl, title);
		window.open(shareLink, "_blank", "width=600,height=400");
	};

	return (
		<>
			<Dialog
				open={open}
				onClose={onClose}
				maxWidth="sm"
				fullWidth
				PaperProps={{
					sx: {
						background: "transparent",
						boxShadow: "none",
						overflow: "visible",
					},
				}}
				sx={{
					"& .MuiBackdrop-root": {
						backdropFilter: glassBlur.strong,
						WebkitBackdropFilter: glassBlur.strong,
						backgroundColor: "rgba(0, 0, 0, 0.7)",
					},
				}}
			>
				<DialogContent
					sx={{
						p: 0,
						position: "relative",
						overflow: "visible",
					}}
				>
					{/* Main Glass Container */}
					<Box
						sx={{
							position: "relative",
							background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
							backdropFilter: glassBlur.medium,
							WebkitBackdropFilter: glassBlur.medium,
							border: `1px solid ${glassColors.glass.border}`,
							borderRadius: glassBorderRadius.xl,
							boxShadow: `0 24px 64px -8px rgba(0, 0, 0, 0.4),
                          inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
							p: 4,
							overflow: "hidden",
						}}
					>
						{/* Persian Pattern Background */}
						<Box
							sx={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								opacity: 0.03,
								backgroundImage: `
                  radial-gradient(circle at 25% 25%, ${glassColors.gold.light} 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, ${glassColors.gold.light} 0%, transparent 50%)
                `,
								backgroundSize: "100px 100px",
								pointerEvents: "none",
							}}
						/>

						{/* Close Button */}
						<IconButton
							onClick={onClose}
							sx={{
								position: "absolute",
								top: 16,
								right: 16,
								zIndex: 2,
								width: 40,
								height: 40,
								background: glassColors.glass.base,
								border: `1px solid ${glassColors.glass.border}`,
								backdropFilter: "blur(10px)",
								transition: glassAnimations.transition.spring,
								"&:hover": {
									transform: "translateY(-2px) scale(1.05)",
									border: `1px solid ${glassColors.gold.light}`,
									background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
									boxShadow: `0 8px 24px -4px ${glassColors.gold.glow}`,
								},
								"& svg": {
									color: glassColors.text.secondary,
									transition: `color ${glassAnimations.duration.normal} ease`,
								},
								"&:hover svg": {
									color: glassColors.white,
								},
							}}
						>
							<Close />
						</IconButton>

						{/* Header */}
						<Box
							sx={{
								position: "relative",
								zIndex: 1,
								textAlign: "center",
								mb: 4,
							}}
						>
							{/* Share Icon with Glow */}
							<Box
								sx={{
									width: 64,
									height: 64,
									margin: "0 auto 16px",
									borderRadius: glassBorderRadius.md,
									background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
									backdropFilter: "blur(10px)",
									border: `1px solid ${glassColors.persianGold}60`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									boxShadow: `0 8px 32px -4px ${glassColors.gold.glow},
                            inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
									animation: `pulse 2s ${glassAnimations.spring} infinite`,
									"@keyframes pulse": {
										"0%, 100%": {
											transform: "scale(1)",
											boxShadow: `0 8px 32px -4px ${glassColors.gold.glow}`,
										},
										"50%": {
											transform: "scale(1.05)",
											boxShadow: `0 12px 48px -4px ${glassColors.gold.glow}`,
										},
									},
								}}
							>
								<Share
									sx={{
										fontSize: 32,
										color: glassColors.persianGold,
									}}
								/>
							</Box>

							<Typography
								variant="h5"
								sx={{
									color: glassColors.text.primary,
									fontWeight: 600,
									mb: 1,
									textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
								}}
							>
								اشتراک‌گذاری
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: glassColors.text.secondary,
									maxWidth: "80%",
									margin: "0 auto",
								}}
							>
								این محتوا را با دوستان خود به اشتراک بگذارید
							</Typography>
						</Box>

						{/* Social Media Grid */}
						<Box
							sx={{
								position: "relative",
								zIndex: 1,
								display: "grid",
								gridTemplateColumns: "repeat(5, 1fr)",
								gap: 2,
								mb: 4,
							}}
						>
							{socialPlatforms.map((platform) => {
								const IconComponent = platform.icon;
								return (
									<Box
										key={platform.id}
										onClick={() => handleSocialShare(platform)}
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											gap: 1,
											cursor: "pointer",
											position: "relative",
											transition: glassAnimations.transition.spring,
											"&:hover .social-icon": {
												transform: "translateY(-8px) scale(1.1)",
												background: `linear-gradient(135deg, ${platform.color}40, ${platform.color}20)`,
												border: `1px solid ${platform.color}80`,
												boxShadow: `0 12px 32px -4px ${platform.color}40`,
											},
											"&:hover .social-name": {
												color: glassColors.white,
											},
										}}
									>
										<Box
											className="social-icon"
											sx={{
												width: 56,
												height: 56,
												borderRadius: glassBorderRadius.md,
												background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
												backdropFilter: "blur(10px)",
												border: `1px solid ${glassColors.glass.border}`,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												transition: glassAnimations.transition.spring,
												boxShadow: `0 4px 16px -2px rgba(0, 0, 0, 0.2),
                              inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
											}}
										>
											<IconComponent
												sx={{
													fontSize: 28,
													color: platform.color,
												}}
											/>
										</Box>
										<Typography
											className="social-name"
											variant="caption"
											sx={{
												color: glassColors.text.tertiary,
												fontSize: "0.7rem",
												fontWeight: 500,
												transition: `color ${glassAnimations.duration.normal} ease`,
											}}
										>
											{platform.name}
										</Typography>
									</Box>
								);
							})}
						</Box>

						{/* Divider */}
						<Box
							sx={{
								position: "relative",
								zIndex: 1,
								display: "flex",
								alignItems: "center",
								gap: 2,
								mb: 3,
							}}
						>
							<Box
								sx={{
									flex: 1,
									height: "1px",
									background: `linear-gradient(90deg, transparent, ${glassColors.glass.border}, transparent)`,
								}}
							/>
							<Typography
								variant="caption"
								sx={{
									color: glassColors.text.tertiary,
									fontSize: "0.75rem",
								}}
							>
								یا
							</Typography>
							<Box
								sx={{
									flex: 1,
									height: "1px",
									background: `linear-gradient(90deg, transparent, ${glassColors.glass.border}, transparent)`,
								}}
							/>
						</Box>

						{/* Copy Link Section */}
						<Box
							sx={{
								position: "relative",
								zIndex: 1,
							}}
						>
							<Typography
								variant="body2"
								sx={{
									color: glassColors.text.secondary,
									mb: 1.5,
									fontSize: "0.875rem",
								}}
							>
								کپی لینک
							</Typography>
							<Box
								sx={{
									display: "flex",
									gap: 1,
								}}
							>
								<TextField
									fullWidth
									value={shareUrl}
									variant="outlined"
									dir="ltr"
									InputProps={{
										readOnly: true,
									}}
									sx={{
										"& .MuiOutlinedInput-root": {
											background: `linear-gradient(135deg, ${glassColors.glass.mid}, ${glassColors.glass.base})`,
											backdropFilter: "blur(10px)",
											border: `1px solid ${glassColors.glass.border}`,
											borderRadius: glassBorderRadius.md,
											color: glassColors.text.secondary,
											fontSize: "0.875rem",
											transition: glassAnimations.transition.spring,
											"& fieldset": {
												border: "none",
											},
											"&:hover": {
												border: `1px solid ${glassColors.glass.border}`,
												background: glassColors.glass.strong,
											},
											"&.Mui-focused": {
												border: `1px solid ${glassColors.gold.light}`,
												boxShadow: `0 4px 16px -2px ${glassColors.gold.glow}`,
											},
											"& input": {
												color: glassColors.text.secondary,
												fontSize: "0.875rem",
												padding: "12px 14px",
											},
										},
									}}
								/>
								<IconButton
									onClick={handleCopyLink}
									sx={{
										width: 48,
										height: 48,
										background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
										backdropFilter: "blur(10px)",
										border: `1px solid ${glassColors.persianGold}60`,
										borderRadius: glassBorderRadius.md,
										transition: glassAnimations.transition.spring,
										boxShadow: `0 4px 16px -2px ${glassColors.gold.glow},
                            inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
										"&:hover": {
											transform: "translateY(-2px) scale(1.05)",
											boxShadow: `0 8px 24px -4px ${glassColors.gold.glow},
                              inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`,
										},
									}}
								>
									<ContentCopy
										sx={{
											fontSize: 20,
											color: glassColors.persianGold,
										}}
									/>
								</IconButton>
							</Box>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>

			{/* Copy Success Snackbar */}
			<Snackbar
				open={showCopySuccess}
				autoHideDuration={2000}
				onClose={() => setShowCopySuccess(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => setShowCopySuccess(false)}
					severity="success"
					sx={{
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: glassBlur.medium,
						WebkitBackdropFilter: glassBlur.medium,
						border: `1px solid ${glassColors.gold.light}`,
						borderRadius: glassBorderRadius.md,
						color: glassColors.text.primary,
						boxShadow: `0 8px 32px -4px ${glassColors.gold.glow},
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
						"& .MuiAlert-icon": {
							color: glassColors.persianGold,
						},
					}}
				>
					لینک با موفقیت کپی شد!
				</Alert>
			</Snackbar>
		</>
	);
};
