"use client";

import { DollarSign, Film, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
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
	Area,
	AreaChart,
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

const STAT_CONFIGS = [
	{
		key: "users",
		icon: Users,
		gradient: "from-indigo-500 to-purple-600",
		iconBg: "bg-indigo-500/20",
		changeColor: "text-emerald-400",
	},
	{
		key: "content",
		icon: Film,
		gradient: "from-blue-500 to-cyan-500",
		iconBg: "bg-blue-500/20",
		changeColor: "text-emerald-400",
	},
	{
		key: "revenue",
		icon: DollarSign,
		gradient: "from-emerald-500 to-teal-500",
		iconBg: "bg-emerald-500/20",
		changeColor: "text-emerald-400",
	},
	{
		key: "subscriptions",
		icon: TrendingUp,
		gradient: "from-amber-500 to-orange-500",
		iconBg: "bg-amber-500/20",
		changeColor: "text-emerald-400",
	},
];

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
		return (
			<div className="space-y-6">
				{/* Skeleton Header */}
				<div className="space-y-2">
					<div className="h-8 w-64 bg-gray-200 rounded-xl animate-pulse" />
					<div className="h-5 w-48 bg-gray-100 rounded-lg animate-pulse" />
				</div>
				{/* Skeleton Stats */}
				<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="h-36 bg-gray-200 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
					))}
				</div>
				{/* Skeleton Charts */}
				<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
					{[...Array(2)].map((_, i) => (
						<div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
					))}
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
					<p className="text-gray-500 font-medium">{t("admin.messages.error")}</p>
				</div>
			</div>
		);
	}

	const canSeeFinance = userRole === "admin" || userRole === "finance";
	const canSeeContent = userRole === "admin" || userRole === "content_manager" || userRole === "viewer";

	const stats = [
		...(canSeeContent
			? [
					{
						title: t("admin.dashboard.totalUsers"),
						value: data.users?.total || 0,
						config: STAT_CONFIGS[0],
						change: "+12%",
						isPositive: true,
					},
					{
						title: t("admin.dashboard.totalContent"),
						value: data.content?.total || 0,
						config: STAT_CONFIGS[1],
						change: "+5%",
						isPositive: true,
					},
			  ]
			: []),
		...(canSeeFinance
			? [
					{
						title: t("admin.dashboard.revenue"),
						value: `$${data.subscriptions?.revenue?.toFixed(2) || "0.00"}`,
						config: STAT_CONFIGS[2],
						change: "+8%",
						isPositive: true,
					},
					{
						title: t("admin.dashboard.activeSubscriptions"),
						value: data.subscriptions?.active || 0,
						config: STAT_CONFIGS[3],
						change: "+3%",
						isPositive: true,
					},
			  ]
			: []),
	];

	// Get current greeting based on time
	const hour = new Date().getHours();
	const greeting = hour < 12 ? "صبح بخیر" : hour < 17 ? "ظهر بخیر" : "عصر بخیر";

	return (
		<div className="space-y-6">
			{/* Welcome Header */}
			<div className="admin-fade-in">
				<div className="flex items-center gap-3 mb-1">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						{greeting}، {user?.name || "مدیر"} 👋
					</h1>
				</div>
				<p className="text-sm sm:text-base text-gray-500">{t("admin.dashboard.welcome")}</p>
			</div>

			{/* Stats Grid */}
			<div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${stats.length >= 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
				{stats.map((stat, index) => {
					const Icon = stat.config.icon;
					return (
						<div
							key={stat.title}
							className={`admin-fade-in admin-stagger-${index + 1}`}
							style={{ opacity: 0 }}
						>
							<div className={`relative overflow-hidden rounded-2xl bg-linear-to-bl ${stat.config.gradient} p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}>
								{/* Background Pattern */}
								<div className="absolute top-0 left-0 w-full h-full opacity-10">
									<div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/20" />
									<div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
								</div>

								<div className="relative z-10">
									<div className="flex items-center justify-between mb-4">
										<div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.config.iconBg} backdrop-blur-sm`}>
											<Icon className="h-5 w-5 text-white" />
										</div>
										<div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? 'text-emerald-200' : 'text-red-200'} bg-white/10 rounded-full px-2.5 py-1`}>
											{stat.isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
											{stat.change}
										</div>
									</div>
									<div className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">{stat.value}</div>
									<p className="text-sm text-white/70 font-medium">{stat.title}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Charts Section */}
			<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
				{canSeeContent && (
					<Card className="admin-fade-in admin-stagger-5 border-0 shadow-sm hover:shadow-md transition-shadow duration-300" style={{ opacity: 0 }}>
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base font-semibold text-gray-800">{t("admin.dashboard.dailyActiveUsers")}</CardTitle>
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
									<Users className="h-4 w-4 text-indigo-500" />
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="h-60 sm:h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart data={data.users?.dailyActive || []}>
										<defs>
											<linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
												<stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
												<stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
										<XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} />
										<YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} />
										<Tooltip
											contentStyle={{
												background: 'white',
												border: 'none',
												borderRadius: '12px',
												boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
												padding: '10px 14px',
												fontSize: '13px',
											}}
										/>
										<Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorUsers)" />
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				)}

				{canSeeContent && (
					<Card className="admin-fade-in admin-stagger-6 border-0 shadow-sm hover:shadow-md transition-shadow duration-300" style={{ opacity: 0 }}>
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base font-semibold text-gray-800">{t("admin.dashboard.topPerformingContent")}</CardTitle>
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
									<Film className="h-4 w-4 text-blue-500" />
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="h-60 sm:h-[300px] overflow-x-auto">
								<div className="min-w-[400px] h-full">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={data.content?.topPerforming?.slice(0, 10) || []} barSize={24}>
											<defs>
												<linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
													<stop offset="0%" stopColor="#3b82f6" />
													<stop offset="100%" stopColor="#6366f1" />
												</linearGradient>
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
											<XAxis
												dataKey="title"
												angle={-45}
												textAnchor="end"
												height={80}
												tick={{ fontSize: 10, fill: '#94a3b8' }}
												axisLine={{ stroke: '#e2e8f0' }}
											/>
											<YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} />
											<Tooltip
												contentStyle={{
													background: 'white',
													border: 'none',
													borderRadius: '12px',
													boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
													padding: '10px 14px',
													fontSize: '13px',
												}}
											/>
											<Bar dataKey="views" fill="url(#colorBar)" radius={[6, 6, 0, 0]} />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
