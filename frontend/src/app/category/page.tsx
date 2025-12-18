"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { Card, CardContent } from "@mui/material";
import { useLanguage } from "@/providers/language-provider";

const categories = [
	{ slug: "coming-soon", labelEn: "Coming Soon", labelFa: "به‌زودی" },
	{ slug: "collections", labelEn: "Collections", labelFa: "مجموعه‌ها" },
	{ slug: "kids", labelEn: "Kids Zone", labelFa: "کودکان" },
];

export default function CategoryPage() {
	const { language } = useLanguage();

	return (
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<Stack spacing={3}>
				<Box component="header">
					<Typography
						variant="overline"
						sx={{
							fontSize: "0.75rem",
							letterSpacing: "0.4em",
							color: "rgba(255, 255, 255, 0.6)",
						}}
					>
						{language === "fa" ? "دسته‌بندی" : "Categories"}
					</Typography>
					<Typography
						variant="h3"
						sx={{
							fontSize: "1.875rem",
							fontWeight: 600,
							color: "#fff",
							mt: 0.5,
						}}
					>
						{language === "fa" ? "سایر" : "Other Categories"}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 0.5 }}
					>
						{language === "fa"
							? "دسته‌بندی‌های ویژه و مجموعه‌های منتخب"
							: "Special categories and curated collections"}
					</Typography>
				</Box>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: {
							xs: "1fr",
							sm: "repeat(2, 1fr)",
							lg: "repeat(3, 1fr)",
						},
						gap: 3,
					}}
				>
					{categories.map((cat) => (
						<Link
							key={cat.slug}
							href={`/category/${cat.slug}`}
							style={{ textDecoration: "none" }}
						>
							<Card
								sx={{
									background: "rgba(255, 255, 255, 0.06)",
									backdropFilter: "blur(20px)",
									border: "1px solid rgba(255, 255, 255, 0.12)",
									borderRadius: 4,
									height: "100%",
									transition: "all 0.3s",
									"&:hover": {
										transform: "scale(1.02)",
										borderColor: "primary.light",
										boxShadow: "0 0 40px rgba(0, 212, 255, 0.3)",
									},
								}}
							>
								<CardContent sx={{ p: 4 }}>
									<Typography
										variant="h5"
										sx={{ fontWeight: 600, color: "#fff", mb: 1 }}
									>
										{language === "fa" ? cat.labelFa : cat.labelEn}
									</Typography>
									<Typography
										variant="body2"
										sx={{ color: "rgba(255, 255, 255, 0.7)" }}
									>
										{language === "fa"
											? `مشاهده ${cat.labelFa}`
											: `Browse ${cat.labelEn}`}
									</Typography>
								</CardContent>
							</Card>
						</Link>
					))}
				</Box>
			</Stack>
		</Container>
	);
}
