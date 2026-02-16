"use client";

import { Send, ThumbUp } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	IconButton,
	MenuItem,
	Select,
	Snackbar,
	TextField,
	Typography,
} from "@mui/material";
import {
	glassAnimations,
	glassBorderRadius,
	glassColors,
	glassStyles,
} from "@/theme/glass-design-system";
import { useState, useEffect, useCallback } from "react";
import { publicCommentsApi, type PublicComment } from "@/lib/api/public";
import { useIsAuthenticated, useUser } from "@/store/auth";
import Link from "next/link";

interface CommentsProps {
	itemId: string;
}

export function Comments({ itemId }: CommentsProps) {
	const [sortBy, setSortBy] = useState<"newest" | "top">("newest");
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState<PublicComment[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successSnackbar, setSuccessSnackbar] = useState(false);
	const isAuthenticated = useIsAuthenticated();
	const currentUser = useUser();

	const fetchComments = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await publicCommentsApi.getByContentId(itemId);
			// Backend returns { comments: [...] } or { data: [...] }
			const commentsList = response.comments || response.data || [];
			setComments(commentsList);
		} catch (err) {
			console.error("Failed to fetch comments:", err);
			setError("خطا در بارگذاری نظرات");
			setComments([]);
		} finally {
			setLoading(false);
		}
	}, [itemId]);

	useEffect(() => {
		if (itemId) {
			fetchComments();
		}
	}, [itemId, fetchComments]);

	const handleSubmit = async () => {
		if (!newComment.trim()) return;

		try {
			setSubmitting(true);
			await publicCommentsApi.create({
				text: newComment.trim(),
				contentId: itemId,
			});
			setNewComment("");
			setSuccessSnackbar(true);
			// Refresh comments after successful submission
			await fetchComments();
		} catch (err) {
			console.error("Failed to submit comment:", err);
			setError("خطا در ارسال نظر. لطفاً دوباره تلاش کنید.");
		} finally {
			setSubmitting(false);
		}
	};

	// Sort comments
	const sortedComments = [...comments].sort((a, b) => {
		if (sortBy === "top") {
			return (b.likesCount || 0) - (a.likesCount || 0);
		}
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	// Separate top-level comments and replies
	const topLevelComments = sortedComments.filter((c) => !c.parentId);
	const repliesMap = sortedComments
		.filter((c) => c.parentId)
		.reduce(
			(acc, reply) => {
				if (!acc[reply.parentId!]) acc[reply.parentId!] = [];
				acc[reply.parentId!].push(reply);
				return acc;
			},
			{} as Record<string, PublicComment[]>,
		);

	return (
		<Box sx={{ ...glassStyles.card, p: { xs: 3, md: 4 } }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Typography
					variant="h5"
					sx={{
						color: glassColors.text.primary,
						fontWeight: 700,
						letterSpacing: "-0.01em",
					}}
					dir="rtl"
				>
					نظرات ({comments.length})
				</Typography>

				<Select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value as "newest" | "top")}
					size="small"
					sx={{
						...glassStyles.card,
						minWidth: 120,
						"& .MuiOutlinedInput-notchedOutline": {
							border: "none",
						},
						"& .MuiSelect-select": {
							color: glassColors.text.secondary,
							fontSize: "0.875rem",
						},
					}}
					dir="rtl"
				>
					<MenuItem value="newest">جدیدترین</MenuItem>
					<MenuItem value="top">محبوب‌ترین</MenuItem>
				</Select>
			</Box>

			{/* Comment Input */}
			{isAuthenticated ? (
			<Box
				sx={{
					...glassStyles.card,
					p: 2,
					mb: 3,
					background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
				}}
			>
				<Box sx={{ display: "flex", gap: 2 }}>
					<Avatar
						sx={{
							width: 40,
							height: 40,
							bgcolor: glassColors.persianGold,
							border: `2px solid ${glassColors.glass.border}`,
						}}
					>
						{currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
					</Avatar>

					<Box sx={{ flex: 1 }}>
						<TextField
							fullWidth
							multiline
							rows={3}
							placeholder="نظر خود را بنویسید..."
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							sx={{
								"& .MuiOutlinedInput-root": {
									background: glassColors.glass.base,
									border: `1px solid ${glassColors.glass.border}`,
									borderRadius: glassBorderRadius.md,
									color: glassColors.text.primary,
									"& fieldset": {
										border: "none",
									},
									"&:hover": {
										border: `1px solid ${glassColors.glass.strong}`,
									},
									"&.Mui-focused": {
										border: `1px solid ${glassColors.persianGold}40`,
									},
								},
								"& .MuiInputBase-input": {
									fontSize: "0.95rem",
								},
								"& .MuiInputBase-input::placeholder": {
									color: glassColors.text.muted,
									opacity: 1,
								},
							}}
							dir="rtl"
						/>

						<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
							<Button
								endIcon={submitting ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : <Send />}
								onClick={handleSubmit}
								disabled={!newComment.trim() || submitting}
								sx={{
									...glassStyles.pillButton,
									px: 3,
									py: 1,
									background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
									border: `1px solid ${glassColors.persianGold}`,
									color: glassColors.text.primary,
									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: `0 8px 24px -8px ${glassColors.gold.glow}`,
									},
									"&:disabled": {
										opacity: 0.4,
										transform: "none",
									},
								}}
							>
								ارسال نظر
							</Button>
						</Box>
					</Box>
				</Box>
			</Box>
			) : (
				<Box
					sx={{
						textAlign: "center",
						py: 3,
						mb: 3,
						borderRadius: glassBorderRadius.md,
						background: glassColors.glass.base,
						border: `1px solid ${glassColors.glass.border}`,
					}}
					dir="rtl"
				>
					<Typography sx={{ color: glassColors.text.secondary, fontSize: "0.9rem" }}>
						برای ارسال نظر لطفاً{" "}
						<Link href="/auth/login" style={{ color: glassColors.persianGold, textDecoration: "underline" }}>
							وارد حساب کاربری
						</Link>{" "}
						شوید.
					</Typography>
				</Box>
			)}

			{/* Comments List */}
			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
					<CircularProgress size={32} sx={{ color: glassColors.persianGold }} />
				</Box>
			) : error && comments.length === 0 ? (
				<Box sx={{ textAlign: "center", py: 4 }}>
					<Typography sx={{ color: glassColors.text.muted, fontSize: "0.9rem" }} dir="rtl">
						{error}
					</Typography>
				</Box>
			) : topLevelComments.length === 0 ? (
				<Box sx={{ textAlign: "center", py: 4 }}>
					<Typography sx={{ color: glassColors.text.muted, fontSize: "0.9rem" }} dir="rtl">
						هنوز نظری ثبت نشده. اولین نفر باشید!
					</Typography>
				</Box>
			) : (
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					{topLevelComments.map((comment) => (
						<Box key={comment.id}>
							<CommentItem comment={comment} itemId={itemId} onRefresh={fetchComments} />

							{/* Nested Replies */}
							{repliesMap[comment.id] && repliesMap[comment.id].length > 0 && (
								<Box sx={{ ml: { xs: 4, md: 6 }, mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
									{repliesMap[comment.id].map((reply) => (
										<CommentItem key={reply.id} comment={reply} isReply itemId={itemId} onRefresh={fetchComments} />
									))}
								</Box>
							)}
						</Box>
					))}
				</Box>
			)}

			{/* Error message for submit */}
			{error && comments.length > 0 && (
				<Typography sx={{ color: "rgba(239, 68, 68, 0.8)", fontSize: "0.8rem", mt: 2, textAlign: "center" }} dir="rtl">
					{error}
				</Typography>
			)}

			{/* Toast after comment submission */}
			<Snackbar
				open={successSnackbar}
				autoHideDuration={5000}
				onClose={() => setSuccessSnackbar(false)}
				message="نظر شما ارسال شد و پس از بررسی منتشر خواهد شد."
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				sx={{
					"& .MuiSnackbarContent-root": {
						background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
						backdropFilter: "blur(20px)",
						border: `1px solid ${glassColors.glass.border}`,
						borderRadius: glassBorderRadius.md,
						color: glassColors.text.primary,
						fontFamily: "inherit",
						direction: "rtl",
					},
				}}
			/>
		</Box>
	);
}

interface CommentItemProps {
	comment: PublicComment;
	isReply?: boolean;
	itemId: string;
	onRefresh: () => void;
}

function CommentItem({ comment, isReply, itemId, onRefresh }: CommentItemProps) {
	const [liked, setLiked] = useState(false);
	const [localLikes, setLocalLikes] = useState(comment.likesCount || 0);
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyText, setReplyText] = useState("");
	const [submittingReply, setSubmittingReply] = useState(false);
	const isAuthenticated = useIsAuthenticated();

	const authorName = comment.user?.name || comment.userName || "کاربر";
	const authorAvatar = comment.user?.avatarUrl || "";
	const timeAgo = new Date(comment.createdAt).toLocaleDateString("fa-IR");

	const handleLike = async () => {
		if (liked) return;
		try {
			const result = await publicCommentsApi.like(comment.id);
			setLocalLikes(result.likesCount);
			setLiked(true);
		} catch {
			// silently fail
		}
	};

	const handleSubmitReply = async () => {
		if (!replyText.trim()) return;
		setSubmittingReply(true);
		try {
			await publicCommentsApi.create({
				text: replyText.trim(),
				contentId: itemId,
				parentId: comment.id,
			});
			setReplyText("");
			setShowReplyForm(false);
			onRefresh();
		} catch {
			// silently fail
		} finally {
			setSubmittingReply(false);
		}
	};

	return (
		<Box
			sx={{
				...glassStyles.card,
				p: 2.5,
				background: isReply
					? glassColors.glass.base
					: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
				transition: glassAnimations.transition.smooth,
				"&:hover": {
					border: `1px solid ${glassColors.glass.strong}`,
				},
			}}
		>
			<Box sx={{ display: "flex", gap: 2 }}>
				{/* Avatar */}
				<Avatar
					src={authorAvatar}
					alt={authorName}
					sx={{
						width: isReply ? 36 : 44,
						height: isReply ? 36 : 44,
						border: `2px solid ${glassColors.glass.border}`,
						boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.3)",
					}}
				/>

				{/* Content */}
				<Box sx={{ flex: 1 }}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							mb: 1,
						}}
					>
						<Typography
							sx={{
								color: glassColors.text.primary,
								fontWeight: 600,
								fontSize: isReply ? "0.85rem" : "0.95rem",
							}}
							dir="rtl"
						>
							{authorName}
						</Typography>

						<Typography
							sx={{
								color: glassColors.text.muted,
								fontSize: "0.75rem",
							}}
							dir="rtl"
						>
							{timeAgo}
						</Typography>
					</Box>

					<Typography
						sx={{
							color: glassColors.text.secondary,
							lineHeight: 1.6,
							mb: 1.5,
							fontSize: "0.9rem",
						}}
						dir="rtl"
					>
						{comment.text}
					</Typography>

					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<IconButton
							size="small"
							onClick={handleLike}
							sx={{
								color: liked ? glassColors.persianGold : glassColors.text.muted,
								transition: glassAnimations.transition.springFast,
								"&:hover": {
									color: glassColors.persianGold,
									transform: "scale(1.1)",
								},
							}}
						>
							<ThumbUp sx={{ fontSize: "1rem" }} />
						</IconButton>

						<Typography
							sx={{
								color: liked ? glassColors.persianGold : glassColors.text.muted,
								fontSize: "0.85rem",
								fontWeight: 600,
							}}
						>
							{localLikes}
						</Typography>

						{!isReply && isAuthenticated && (
							<Button
								size="small"
								onClick={() => setShowReplyForm(!showReplyForm)}
								sx={{
									color: showReplyForm ? glassColors.persianGold : glassColors.text.secondary,
									fontSize: "0.8rem",
									textTransform: "none",
									minWidth: "auto",
									px: 1,
									"&:hover": {
										color: glassColors.text.primary,
										background: glassColors.glass.base,
									},
								}}
								dir="rtl"
							>
								پاسخ
							</Button>
						)}
					</Box>

					{/* Reply Form */}
					{showReplyForm && isAuthenticated && (
						<Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "flex-start" }}>
							<TextField
								fullWidth
								size="small"
								multiline
								rows={2}
								placeholder="پاسخ خود را بنویسید..."
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
								sx={{
									"& .MuiOutlinedInput-root": {
										background: glassColors.glass.base,
										border: `1px solid ${glassColors.glass.border}`,
										borderRadius: glassBorderRadius.md,
										color: glassColors.text.primary,
										"& fieldset": { border: "none" },
									},
									"& .MuiInputBase-input::placeholder": {
										color: glassColors.text.muted,
										opacity: 1,
									},
								}}
								dir="rtl"
							/>
							<IconButton
								onClick={handleSubmitReply}
								disabled={!replyText.trim() || submittingReply}
								sx={{
									color: glassColors.persianGold,
									mt: 0.5,
									"&:disabled": { opacity: 0.4 },
								}}
							>
								{submittingReply ? (
									<CircularProgress size={20} sx={{ color: glassColors.persianGold }} />
								) : (
									<Send sx={{ fontSize: "1.2rem" }} />
								)}
							</IconButton>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
}
