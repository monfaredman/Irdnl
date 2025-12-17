"use client";

import { Ban, CheckCircle, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/admin/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/admin/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/admin/ui/table";
import { usersApi } from "@/lib/api/admin";

export default function UsersManagementPage() {
	const [users, setUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [search, setSearch] = useState("");

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const response = await usersApi.list({ page, limit: 20, search });
			setUsers(response.data || []);
			setTotal(response.total || 0);
		} catch (error) {
			console.error("Failed to fetch users:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [page, search]);

	const handleToggleActive = async (id: string, isActive: boolean) => {
		try {
			await usersApi.update(id, { isActive: !isActive });
			fetchUsers();
		} catch (error) {
			console.error("Failed to update user:", error);
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this user?")) {
			try {
				await usersApi.delete(id);
				fetchUsers();
			} catch (error) {
				console.error("Failed to delete user:", error);
			}
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">User Management</h1>
				<p className="text-gray-600">Manage user accounts</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Users List</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-4">
						<input
							type="text"
							placeholder="Search users..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							className="w-full rounded-md border border-gray-300 px-3 py-2"
						/>
					</div>
					{loading ? (
						<div className="p-6 text-center">Loading...</div>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{users.map((user) => (
										<TableRow key={user.id}>
											<TableCell className="font-medium">{user.name}</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>{user.role}</TableCell>
											<TableCell>
												<span
													className={`rounded-full px-2 py-1 text-xs ${
														user.isActive
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{user.isActive ? "Active" : "Blocked"}
												</span>
											</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															handleToggleActive(user.id, user.isActive)
														}
													>
														{user.isActive ? (
															<Ban className="h-4 w-4" />
														) : (
															<CheckCircle className="h-4 w-4" />
														)}
													</Button>
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDelete(user.id)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							<div className="mt-4 flex items-center justify-between">
								<div className="text-sm text-gray-600">
									Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)}{" "}
									of {total}
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page === 1}
									>
										Previous
									</Button>
									<Button
										variant="outline"
										onClick={() => setPage((p) => p + 1)}
										disabled={page * 20 >= total}
									>
										Next
									</Button>
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
