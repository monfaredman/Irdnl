"use client";

import { Send, ThumbUp } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	IconButton,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import {
	glassAnimations,
	glassBorderRadius,
	glassColors,
	glassStyles,
} from "@/theme/glass-design-system";
import { useState } from "react";

interface Comment {
	id: string;
	author: {
		name: string;
		avatar: string;
	};
	content: string;
	likes: number;
	timestamp: string;
	replies?: Comment[];
}

const mockComments: Comment[] = [
	{
		id: "1",
		author: {
			name: "علی محمدی",
			avatar: "/images/avatars/user-1.svg",
		},
		content: "یکی از بهترین سریال‌هایی که دیدم! داستان و بازی‌ها عالی بودند.",
		likes: 24,
		timestamp: "۲ ساعت پیش",
		replies: [
			{
				id: "1-1",
				author: {
					name: "سارا احمدی",
					avatar: "/images/avatars/user-2.svg",
				},
				content: "کاملا موافقم! به نظرم فصل دوم هم خیلی خوب بود.",
				likes: 8,
				timestamp: "۱ ساعت پیش",
			},
		],
	},
	{
		id: "2",
		author: {
			name: "رضا کریمی",
			avatar: "/images/avatars/user-3.svg",
		},
		content: "کارگردانی فوق‌العاده و تصویربرداری حرفه‌ای. پیشنهاد می‌کنم حتما ببینید.",
		likes: 15,
		timestamp: "۵ ساعت پیش",
	},
];

interface CommentsProps {
	itemId: string;
}

export function Comments({ itemId }: CommentsProps) {
	const [sortBy, setSortBy] = useState<"newest" | "top">("newest");
	const [newComment, setNewComment] = useState("");

	const handleSubmit = () => {
		// Handle comment submission with optimistic update
		console.log("Submit comment:", newComment);
		setNewComment("");
	};

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
					نظرات ({mockComments.length})
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
							border: `2px solid ${glassColors.glass.border}`,
						}}
					/>

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
								endIcon={<Send />}
								onClick={handleSubmit}
								disabled={!newComment.trim()}
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

			{/* Comments List */}
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				{mockComments.map((comment) => (
					<Box key={comment.id}>
						<CommentItem comment={comment} />

						{/* Nested Replies */}
						{comment.replies && comment.replies.length > 0 && (
							<Box sx={{ ml: { xs: 4, md: 6 }, mt: 2 }}>
								{comment.replies.map((reply) => (
									<CommentItem key={reply.id} comment={reply} isReply />
								))}
							</Box>
						)}
					</Box>
				))}
			</Box>
		</Box>
	);
}

interface CommentItemProps {
	comment: Comment;
	isReply?: boolean;
}

function CommentItem({ comment, isReply }: CommentItemProps) {
	const [liked, setLiked] = useState(false);

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
					src={comment.author.avatar}
					alt={comment.author.name}
					sx={{
						width: 44,
						height: 44,
						border: `2px solid ${glassColors.glass.border}`,
						boxShadow: `0 4px 12px -2px rgba(0, 0, 0, 0.3)`,
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
								fontSize: "0.95rem",
							}}
							dir="rtl"
						>
							{comment.author.name}
						</Typography>

						<Typography
							sx={{
								color: glassColors.text.muted,
								fontSize: "0.75rem",
							}}
							dir="rtl"
						>
							{comment.timestamp}
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
						{comment.content}
					</Typography>

					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<IconButton
							size="small"
							onClick={() => setLiked(!liked)}
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
							{comment.likes + (liked ? 1 : 0)}
						</Typography>

						{!isReply && (
							<Button
								size="small"
								sx={{
									color: glassColors.text.secondary,
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
				</Box>
			</Box>
		</Box>
	);
}
