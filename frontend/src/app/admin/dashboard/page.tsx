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
import { useAdminAuth } from "@/store/admin-auth";

export default function AdminDashboardPage() {
	const { t } = useTranslation();
	const { user } = useAdminAuth();
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	const userRole = user?.role;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const dashboardData = await analyticsApi.getDashboard();
				setData(dashboardData);
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
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

	const canSeeFinance = userRole === "admin" || userRole === "finance";
	const canSeeContent = userRole === "admin" || userRole === "content_manager" || userRole === "viewer";

	const stats = [
		...(canSeeContent
			? [
					{
						title: t("admin.dashboard.totalUsers"),
						value: data.users?.total || 0,
						icon: Users,
						change: "+12%",
					},
					{
						title: t("admin.dashboard.totalContent"),
						value: data.content?.total || 0,
						icon: Film,
						change: "+5%",
					},
			  ]
			: []),
		...(canSeeFinance
			? [
					{
						title: t("admin.dashboard.revenue"),
						value: `$${data.subscriptions?.revenue?.toFixed(2) || "0.00"}`,
						icon: DollarSign,
						change: "+8%",
					},
					{
						title: t("admin.dashboard.activeSubscriptions"),
						value: data.subscriptions?.active || 0,
						icon: TrendingUp,
						change: "+3%",
					},
			  ]
			: []),
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">{t("admin.dashboard.title")}</h1>
				<p className="text-gray-600">{t("admin.dashboard.welcome")}</p>
			</div>

			<div className={`grid gap-4 md:grid-cols-2 ${stats.length >= 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<Card key={stat.title}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{stat.title}
								</CardTitle>
								<Icon className="h-4 w-4 text-gray-500" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
								<p className="text-xs text-green-600">
									{stat.change} {t("admin.dashboard.fromLastMonth")}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{canSeeContent && (
					<Card>
						<CardHeader>
							<CardTitle>{t("admin.dashboard.dailyActiveUsers")}</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={data.users?.dailyActive || []}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line type="monotone" dataKey="count" stroke="#3b82f6" />
								</LineChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				)}

				{canSeeContent && (
					<Card>
						<CardHeader>
							<CardTitle>{t("admin.dashboard.topPerformingContent")}</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={data.content?.topPerforming?.slice(0, 10) || []}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="title"
										angle={-45}
										textAnchor="end"
										height={100}
									/>
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey="views" fill="#3b82f6" />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
