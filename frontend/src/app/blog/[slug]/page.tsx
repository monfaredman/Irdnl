"use client";

import { useState, useEffect } from "react";
import {
	Box,
	Container,
	Typography,
	Chip,
	Skeleton,
	Stack,
	Divider,
	CircularProgress,
	IconButton,
	TextField,
	Button,
	Avatar,
	Snackbar,
} from "@mui/material";
import {
	CalendarMonth,
	Visibility,
	Favorite,
	FavoriteBorder,
	Person,
	AccessTime,
	ArrowForward,
	Send,
	ThumbUp,
	Reply,
} from "@mui/icons-material";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import {
	glassStyles,
	glassColors,
	glassBorderRadius,
	glassAnimations,
	glassBlur,
} from "@/theme/glass-design-system";
import { publicBlogApi, publicCommentsApi, type PublicComment } from "@/lib/api/public";
import { useIsAuthenticated, useUser } from "@/store/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function BlogPostPage() {
	const params = useParams();
	const slug = params.slug as string;
	const [post, setPost] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const isAuthenticated = useIsAuthenticated();
	const user = useUser();

	// Like state
	const [liked, setLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);

	// Comments state
	const [comments, setComments] = useState<PublicComment[]>([]);
	const [newComment, setNewComment] = useState("");
	const [submittingComment, setSubmittingComment] = useState(false);
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [replyText, setReplyText] = useState("");
	const [snackbar, setSnackbar] = useState<string | null>(null);

	useEffect(() => {
		if (slug) {
			fetchPost();
		}
	}, [slug]);

	const fetchPost = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API_BASE_URL}/blog/${slug}`);
			setPost(response.data);
			setLikesCount(response.data.likesCount || 0);
			// Check if user already liked (stored in localStorage)
			const likedPosts: string[] = JSON.parse(localStorage.getItem("blog_likes") || "[]");
			setLiked(likedPosts.includes(slug));
		} catch (error) {
			console.error("Failed to fetch post:", error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch comments for this blog post (use post.id as contentId)
	useEffect(() => {
		if (post?.id) {
			fetchComments();
		}
	}, [post?.id]);

	const fetchComments = async () => {
		if (!post?.id) return;
		try {
			const response = await publicCommentsApi.getByContentId(post.id);
			const list = response.comments || response.data || [];
			setComments(list);
		} catch {
			// silently fail
		}
	};

	const handleLike = async () => {
		try {
			const result = await publicBlogApi.like(slug);
			setLikesCount(result.likesCount);
			setLiked(true);
			const likedPosts: string[] = JSON.parse(localStorage.getItem("blog_likes") || "[]");
			if (!likedPosts.includes(slug)) {
				likedPosts.push(slug);
				localStorage.setItem("blog_likes", JSON.stringify(likedPosts));
			}
		} catch {
			setSnackbar("خطا در ثبت لایک");
		}
	};

	const handleSubmitComment = async () => {
		if (!newComment.trim() || !post?.id) return;
		setSubmittingComment(true);
		try {
			await publicCommentsApi.create({
				text: newComment.trim(),
				contentId: post.id,
			});
			setNewComment("");
			setSnackbar("نظر شما ارسال شد و پس از تایید نمایش داده می‌شود");
			await fetchComments();
		} catch {
			setSnackbar("خطا در ارسال نظر");
		} finally {
			setSubmittingComment(false);
		}
	};

	const handleSubmitReply = async (parentId: string) => {
		if (!replyText.trim() || !post?.id) return;
		setSubmittingComment(true);
		try {
			await publicCommentsApi.create({
				text: replyText.trim(),
				contentId: post.id,
				parentId,
			});
			setReplyText("");
			setReplyingTo(null);
			setSnackbar("پاسخ شما ارسال شد");
			await fetchComments();
		} catch {
			setSnackbar("خطا در ارسال پاسخ");
		} finally {
			setSubmittingComment(false);
		}
	};

	const handleLikeComment = async (commentId: string) => {
		try {
			const result = await publicCommentsApi.like(commentId);
			setComments((prev) =>
				prev.map((c) =>
					c.id === commentId ? { ...c, likesCount: result.likesCount } : c,
				),
			);
		} catch {
			// silently fail
		}
	};

	const categories: Record<string, string> = {
		news: "اخبار",
		reviews: "نقد و بررسی",
		interviews: "مصاحبه",
		behind_scenes: "پشت صحنه",
		industry: "صنعت",
		technology: "تکنولوژی",
		opinion: "نظر",
		tutorials: "آموزش",
	};

	if (loading) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<CircularProgress sx={{ color: glassColors.persianGold }} />
			</Box>
		);
	}

	if (!post) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Typography sx={{ color: glassColors.text.muted, fontSize: "1.1rem" }}>
					مقاله یافت نشد
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ minHeight: "100vh", py: { xs: 6, md: 10 } }}>
			<Container maxWidth="md">
				{/* Back Button */}
				<Link href="/blog" style={{ textDecoration: "none" }}>
					<Box
						sx={{
							display: "inline-flex",
							alignItems: "center",
							gap: 1,
							mb: 4,
							px: 2.5,
							py: 1,
							borderRadius: glassBorderRadius.pill,
							background: glassColors.glass.mid,
							border: `1px solid ${glassColors.glass.border}`,
							color: glassColors.text.secondary,
							fontSize: "0.875rem",
							transition: glassAnimations.transition.spring,
							cursor: "pointer",
							"&:hover": {
								background: glassColors.glass.strong,
								color: glassColors.persianGold,
								border: `1px solid ${glassColors.gold.light}`,
							},
						}}
						dir="rtl"
					>
						<ArrowForward sx={{ fontSize: "1rem" }} />
						بازگشت به بلاگ
					</Box>
				</Link>

				{/* Cover Image */}
				{post.coverImage && (
					<Box
						sx={{
							width: "100%",
							height: { xs: 250, md: 400 },
							borderRadius: glassBorderRadius.xl,
							overflow: "hidden",
							mb: 4,
							position: "relative",
							border: `1px solid ${glassColors.glass.border}`,
							"&::after": {
								content: '""',
								position: "absolute",
								bottom: 0,
								left: 0,
								right: 0,
								height: "40%",
								background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
							},
						}}
					>
						<Box
							component="img"
							src={post.coverImage}
							alt={post.title}
							sx={{ width: "100%", height: "100%", objectFit: "cover" }}
						/>
					</Box>
				)}

				{/* Article Card */}
				<Box
					sx={{
						...glassStyles.card,
						p: { xs: 3, md: 5 },
					}}
				>
					{/* Meta Info */}
					<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, flexWrap: "wrap" }} dir="rtl">
						<Chip
							label={categories[post.category] || post.category}
							size="small"
							sx={{
								background: glassColors.gold.lighter,
								border: `1px solid ${glassColors.gold.light}`,
								color: glassColors.persianGold,
								fontSize: "0.8rem",
								fontWeight: 600,
							}}
						/>
						<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
							<CalendarMonth sx={{ fontSize: "0.9rem", color: glassColors.text.muted }} />
							<Typography sx={{ color: glassColors.text.muted, fontSize: "0.8rem" }}>
								{new Date(post.createdAt).toLocaleDateString("fa-IR")}
							</Typography>
						</Box>
						{post.readingTime && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
								<AccessTime sx={{ fontSize: "0.9rem", color: glassColors.text.muted }} />
								<Typography sx={{ color: glassColors.text.muted, fontSize: "0.8rem" }}>
									{post.readingTime} دقیقه مطالعه
								</Typography>
							</Box>
						)}
					</Box>

					{/* Title */}
					<Typography
						variant="h3"
						sx={{
							color: glassColors.text.primary,
							fontWeight: 700,
							fontSize: { xs: "1.5rem", md: "2.2rem" },
							lineHeight: 1.4,
							mb: 2,
							letterSpacing: "-0.02em",
						}}
						dir="rtl"
					>
						{post.title}
					</Typography>

					{/* Excerpt */}
					<Typography
						sx={{
							color: glassColors.text.secondary,
							fontSize: "1.1rem",
							lineHeight: 1.7,
							mb: 3,
						}}
						dir="rtl"
					>
						{post.excerpt}
					</Typography>

					{/* Author & Stats Divider */}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							py: 2.5,
							px: 2,
							mb: 4,
							borderRadius: glassBorderRadius.md,
							background: glassColors.glass.base,
							border: `1px solid ${glassColors.glass.border}`,
						}}
						dir="rtl"
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
							<Person sx={{ fontSize: "1.2rem", color: glassColors.persianGold }} />
							<Typography sx={{ color: glassColors.text.primary, fontWeight: 600, fontSize: "0.9rem" }}>
								{post.author?.name || "ناشناس"}
							</Typography>
						</Box>
						<Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
								<Visibility sx={{ fontSize: "1rem", color: glassColors.text.muted }} />
								<Typography sx={{ color: glassColors.text.secondary, fontSize: "0.85rem" }}>
									{post.viewsCount?.toLocaleString("fa-IR")} بازدید
								</Typography>
							</Box>
							<Box
								sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}
								onClick={!liked ? handleLike : undefined}
							>
								{liked ? (
									<Favorite sx={{ fontSize: "1rem", color: "#ef4444" }} />
								) : (
									<FavoriteBorder sx={{ fontSize: "1rem", color: glassColors.text.muted, "&:hover": { color: "#ef4444" } }} />
								)}
								<Typography sx={{ color: liked ? "#ef4444" : glassColors.text.secondary, fontSize: "0.85rem" }}>
									{likesCount.toLocaleString("fa-IR")} لایک
								</Typography>
							</Box>
						</Box>
					</Box>

					{/* Content */}
					<Box
						dir="rtl"
						sx={{
							color: glassColors.text.secondary,
							lineHeight: 2,
							fontSize: "1rem",
							"& p": { mb: 2 },
							"& h2, & h3, & h4": {
								color: glassColors.text.primary,
								fontWeight: 600,
								mt: 4,
								mb: 2,
							},
							"& a": {
								color: glassColors.persianGold,
								textDecoration: "underline",
								textUnderlineOffset: "3px",
							},
							"& blockquote": {
								borderRight: `3px solid ${glassColors.persianGold}`,
								pr: 3,
								mr: 0,
								ml: 2,
								color: glassColors.text.tertiary,
								fontStyle: "italic",
							},
							"& img": {
								borderRadius: glassBorderRadius.md,
								maxWidth: "100%",
								my: 2,
							},
							"& code": {
								background: glassColors.glass.mid,
								px: 1,
								py: 0.25,
								borderRadius: glassBorderRadius.sm,
								fontSize: "0.9em",
							},
						}}
						dangerouslySetInnerHTML={{
							__html: post.content.replace(/\n/g, "<br>"),
						}}
					/>

					{/* Tags */}
					{post.tags && post.tags.length > 0 && (
						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 1,
								mt: 5,
								pt: 4,
								borderTop: `1px solid ${glassColors.glass.border}`,
							}}
							dir="rtl"
						>
							{post.tags.map((tag: string, index: number) => (
								<Chip
									key={index}
									label={`#${tag}`}
									size="small"
									sx={{
										background: glassColors.glass.mid,
										border: `1px solid ${glassColors.glass.border}`,
										color: glassColors.text.secondary,
										fontSize: "0.8rem",
										"&:hover": {
											background: glassColors.glass.strong,
										},
									}}
								/>
							))}
						</Box>
					)}
				</Box>

				{/* ── Comments Section ── */}
				<Box
					sx={{
						...glassStyles.card,
						p: { xs: 3, md: 5 },
						mt: 4,
					}}
				>
					<Typography
						variant="h5"
						sx={{
							color: glassColors.text.primary,
							fontWeight: 700,
							mb: 3,
						}}
						dir="rtl"
					>
						نظرات ({comments.length})
					</Typography>

					{/* Comment Form */}
					{isAuthenticated ? (
						<Box sx={{ mb: 4 }}>
							<Box sx={{ display: "flex", gap: 2 }}>
								<Avatar
									sx={{
										width: 40,
										height: 40,
										bgcolor: glassColors.persianGold,
										border: `2px solid ${glassColors.glass.border}`,
									}}
								>
									{user?.name?.charAt(0)?.toUpperCase() || "U"}
								</Avatar>
								<Box sx={{ flex: 1 }}>
									<TextField
										fullWidth
										multiline
										rows={3}
										placeholder="نظر خود را درباره این مقاله بنویسید..."
										value={newComment}
										onChange={(e) => setNewComment(e.target.value)}
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
									<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
										<Button
											endIcon={submittingComment ? <CircularProgress size={16} sx={{ color: "inherit" }} /> : <Send />}
											onClick={handleSubmitComment}
											disabled={!newComment.trim() || submittingComment}
											sx={{
												px: 3,
												py: 1,
												borderRadius: glassBorderRadius.pill,
												background: `linear-gradient(135deg, ${glassColors.gold.light}, ${glassColors.gold.lighter})`,
												border: `1px solid ${glassColors.persianGold}`,
												color: glassColors.text.primary,
												"&:hover": { transform: "translateY(-2px)", boxShadow: `0 8px 24px -8px ${glassColors.gold.glow}` },
												"&:disabled": { opacity: 0.4, transform: "none" },
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
					{comments.length === 0 ? (
						<Box sx={{ textAlign: "center", py: 3 }}>
							<Typography sx={{ color: glassColors.text.muted, fontSize: "0.9rem" }} dir="rtl">
								هنوز نظری ثبت نشده. اولین نفر باشید!
							</Typography>
						</Box>
					) : (
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							{comments
								.filter((c) => !c.parentId)
								.map((comment) => (
									<Box key={comment.id}>
										<Box
											sx={{
												...glassStyles.card,
												p: 2.5,
												background: `linear-gradient(135deg, ${glassColors.glass.strong}, ${glassColors.glass.mid})`,
											}}
										>
											<Box sx={{ display: "flex", gap: 2 }}>
												<Avatar
													src={comment.user?.avatarUrl}
													sx={{
														width: 40,
														height: 40,
														border: `2px solid ${glassColors.glass.border}`,
													}}
												>
													{(comment.user?.name || comment.userName || "K").charAt(0).toUpperCase()}
												</Avatar>
												<Box sx={{ flex: 1 }}>
													<Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
														<Typography sx={{ color: glassColors.text.primary, fontWeight: 600, fontSize: "0.9rem" }} dir="rtl">
															{comment.user?.name || comment.userName || "کاربر"}
														</Typography>
														<Typography sx={{ color: glassColors.text.muted, fontSize: "0.75rem" }}>
															{new Date(comment.createdAt).toLocaleDateString("fa-IR")}
														</Typography>
													</Box>
													<Typography sx={{ color: glassColors.text.secondary, lineHeight: 1.6, mb: 1, fontSize: "0.9rem" }} dir="rtl">
														{comment.text}
													</Typography>
													<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
														<IconButton
															size="small"
															onClick={() => handleLikeComment(comment.id)}
															sx={{ color: glassColors.text.muted, "&:hover": { color: glassColors.persianGold } }}
														>
															<ThumbUp sx={{ fontSize: "1rem" }} />
														</IconButton>
														<Typography sx={{ color: glassColors.text.muted, fontSize: "0.8rem" }}>
															{comment.likesCount || 0}
														</Typography>
														{isAuthenticated && (
															<Button
																size="small"
																startIcon={<Reply sx={{ fontSize: "0.9rem" }} />}
																onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
																sx={{ color: glassColors.text.secondary, fontSize: "0.8rem", textTransform: "none" }}
															>
																پاسخ
															</Button>
														)}
													</Box>

													{/* Reply Form */}
													{replyingTo === comment.id && isAuthenticated && (
														<Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "flex-start" }}>
															<TextField
																fullWidth
																size="small"
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
																	"& .MuiInputBase-input::placeholder": { color: glassColors.text.muted, opacity: 1 },
																}}
																dir="rtl"
															/>
															<IconButton
																onClick={() => handleSubmitReply(comment.id)}
																disabled={!replyText.trim() || submittingComment}
																sx={{ color: glassColors.persianGold }}
															>
																<Send />
															</IconButton>
														</Box>
													)}
												</Box>
											</Box>
										</Box>

										{/* Nested Replies */}
										{comments
											.filter((r) => r.parentId === comment.id)
											.map((reply) => (
												<Box
													key={reply.id}
													sx={{
														...glassStyles.card,
														p: 2,
														ml: { xs: 4, md: 6 },
														mt: 1.5,
														background: glassColors.glass.base,
													}}
												>
													<Box sx={{ display: "flex", gap: 2 }}>
														<Avatar src={reply.user?.avatarUrl} sx={{ width: 32, height: 32 }}>
															{(reply.user?.name || reply.userName || "K").charAt(0).toUpperCase()}
														</Avatar>
														<Box sx={{ flex: 1 }}>
															<Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
																<Typography sx={{ color: glassColors.text.primary, fontWeight: 600, fontSize: "0.85rem" }} dir="rtl">
																	{reply.user?.name || reply.userName || "کاربر"}
																</Typography>
																<Typography sx={{ color: glassColors.text.muted, fontSize: "0.7rem" }}>
																	{new Date(reply.createdAt).toLocaleDateString("fa-IR")}
																</Typography>
															</Box>
															<Typography sx={{ color: glassColors.text.secondary, fontSize: "0.85rem", lineHeight: 1.6 }} dir="rtl">
																{reply.text}
															</Typography>
														</Box>
													</Box>
												</Box>
											))}
									</Box>
								))}
						</Box>
					)}
				</Box>
			</Container>

			{/* Snackbar */}
			<Snackbar
				open={!!snackbar}
				autoHideDuration={3000}
				onClose={() => setSnackbar(null)}
				message={snackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				sx={{
					"& .MuiSnackbarContent-root": {
						background: glassColors.glass.strong,
						backdropFilter: "blur(20px)",
						border: `1px solid ${glassColors.glass.border}`,
						fontFamily: "Vazirmatn",
						borderRadius: glassBorderRadius.md,
					},
				}}
			/>
		</Box>
	);
}
