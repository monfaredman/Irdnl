"use client";

import { DollarSign, Film, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import { analyticsApi } from "@/lib/api/admin";
import { useTranslation } from "@/i18n";

export default function FinancePage() {
	const { t } = useTranslation();
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const dashboardData = await analyticsApi.getDashboard();
				setData(dashboardData);
			} catch (error) {
				console.error("Failed to fetch finance data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading) {
		return <div className="p-6">{t("admin.messages.loading")}</div>;
	}

	if (!data) {
		return <div className="p-6">{t("admin.messages.error")}</div>;
	}

	const revenue = data.subscriptions?.revenue || 0;
	const activeSubs = data.subscriptions?.active || 0;
	const totalSubs = data.subscriptions?.total || 0;

	return (
		<div className="space-y-4 sm:space-y-6">
			<div>
				<h1 className="text-xl sm:text-3xl font-bold text-gray-900">
					{t("admin.finance.title")}
				</h1>
				<p className="text-sm text-gray-600">{t("admin.finance.description")}</p>
			</div>

			<div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">{t("admin.finance.totalRevenue")}</CardTitle>
						<DollarSign className="h-4 w-4 text-gray-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${revenue.toFixed(2)}</div>
						<p className="text-xs text-green-600">{t("admin.finance.revenueGrowth")}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t("admin.finance.activeSubscribers")}
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-gray-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activeSubs}</div>
						<p className="text-xs text-green-600">+5% {t("admin.dashboard.fromLastMonth")}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t("admin.finance.totalSubscribers")}
						</CardTitle>
						<Users className="h-4 w-4 text-gray-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalSubs}</div>
						<p className="text-xs text-gray-600">{t("admin.finance.allTime")}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t("admin.finance.bandwidthUsage")}
						</CardTitle>
						<Film className="h-4 w-4 text-gray-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data.bandwidth?.total || 0} GB
						</div>
						<p className="text-xs text-gray-600">{t("admin.finance.totalStorage")}</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>{t("admin.finance.monthlyGrowth")}</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={data.growth?.users || []}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="count"
									stroke="#3b82f6"
									name={t("admin.finance.users")}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t("admin.finance.contentGrowth")}</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={data.growth?.content || []}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="count" fill="#3b82f6" name={t("admin.finance.content")} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
