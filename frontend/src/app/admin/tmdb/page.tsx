"use client";

import { useState } from "react";
import { Database } from "lucide-react";
import { Tabs, Tab, Box } from "@mui/material";
import { TMDBBrowseTab } from "./components/TMDBBrowseTab";
import { TMDBSavedTab } from "./components/TMDBSavedTab";
import { useTranslation } from "@/i18n";

export default function TMDBPage() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState(0);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-white flex items-center gap-3">
					<Database className="w-8 h-8" />
					{t("admin.menu.tmdb")}
				</h1>
				<p className="text-gray-400 mt-2">
					{t("admin.tmdb.description")}
				</p>
			</div>

			<Tabs
				value={activeTab}
				onChange={(_, newValue) => setActiveTab(newValue)}
				variant="fullWidth"
			>
				<Tab label={t("admin.tmdb.tabs.browse")} />
				<Tab label={t("admin.tmdb.tabs.saved")} />
			</Tabs>

			<Box sx={{ pt: 3 }}>
				{activeTab === 0 && <TMDBBrowseTab />}
				{activeTab === 1 && <TMDBSavedTab />}
			</Box>
		</div>
	);
}
