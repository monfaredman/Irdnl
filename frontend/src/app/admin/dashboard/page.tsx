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

export default function AdminDashboardPage() {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

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
		return <div className="p-6">Loading...</div>;
	}

	if (!data) {
		return <div className="p-6">Failed to load dashboard data</div>;
	}

	const stats = [
		{
			title: "Total Users",
			value: data.users?.total || 0,
			icon: Users,
			change: "+12%",
		},
		{
			title: "Total Content",
			value: data.content?.total || 0,
			icon: Film,
			change: "+5%",
		},
		{
			title: "Revenue",
			value: `$${data.subscriptions?.revenue?.toFixed(2) || "0.00"}`,
			icon: DollarSign,
			change: "+8%",
		},
		{
			title: "Active Subscriptions",
			value: data.subscriptions?.active || 0,
			icon: TrendingUp,
			change: "+3%",
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
				<p className="text-gray-600">Welcome to the admin dashboard</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
									{stat.change} from last month
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Daily Active Users</CardTitle>
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

				<Card>
					<CardHeader>
						<CardTitle>Top Performing Content</CardTitle>
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
			</div>
		</div>
	);
}
