"use client";

import { useState } from "react";
import { Globe, Film, Tv, ShoppingCart, Monitor, Compass } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import { Tabs, Tab, Box } from "@mui/material";
import { useTranslation } from "@/i18n";
import { UperaBrowseTab } from "./components/UperaBrowseTab";
import { UperaLocalTab } from "./components/UperaLocalTab";
import { UperaPurchaseTab } from "./components/UperaPurchaseTab";
import { UperaScreeningTab } from "./components/UperaScreeningTab";
import { UperaDiscoverTab } from "./components/UperaDiscoverTab";

export default function UperaPage() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState(0);

	const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	return (
		<div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
			<div className="flex items-center gap-2 sm:gap-3">
				<Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-gray-900">
						{t("admin.upera.title")}
					</h1>
					<p className="text-xs sm:text-sm text-gray-500">
						{t("admin.upera.description")}
					</p>
				</div>
			</div>

			<Card>
				<CardContent className="p-0">
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<Tabs
							value={activeTab}
							onChange={handleTabChange}
							variant="fullWidth"
							sx={{
								"& .MuiTab-root": {
									fontFamily: "var(--font-vazirmatn)",
									fontSize: "0.875rem",
									fontWeight: 500,
								},
							}}
						>
							<Tab
								icon={<Film className="h-4 w-4" />}
								iconPosition="start"
								label={t("admin.upera.tabs.browse")}
							/>
							<Tab
								icon={<Tv className="h-4 w-4" />}
								iconPosition="start"
								label={t("admin.upera.tabs.local")}
							/>
							<Tab
								icon={<ShoppingCart className="h-4 w-4" />}
								iconPosition="start"
								label={t("admin.upera.tabs.purchase")}
							/>
							<Tab
								icon={<Monitor className="h-4 w-4" />}
								iconPosition="start"
								label={t("admin.upera.tabs.screening")}
							/>
							<Tab
								icon={<Compass className="h-4 w-4" />}
								iconPosition="start"
								label={t("admin.upera.tabs.discover")}
							/>
						</Tabs>
					</Box>

					<Box sx={{ p: 3 }}>
						{activeTab === 0 && <UperaBrowseTab />}
						{activeTab === 1 && <UperaLocalTab />}
						{activeTab === 2 && <UperaPurchaseTab />}
						{activeTab === 3 && <UperaScreeningTab />}
						{activeTab === 4 && <UperaDiscoverTab />}
					</Box>
				</CardContent>
			</Card>
		</div>
	);
}
