import { Container } from "@mui/material";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchExperience } from "@/components/sections/SearchExperience";

export const metadata: Metadata = {
	title: "Search | irdnl",
	description:
		"Search across irdnl's Persian movies and series catalog with filters for genre and year.",
};

export default function SearchPage() {
	return (
		<Container maxWidth="lg" sx={{ pt: { xs: 10, sm: 12 }, pb: 6 }}>
			<Suspense>
				<SearchExperience />
			</Suspense>
		</Container>
	);
}
