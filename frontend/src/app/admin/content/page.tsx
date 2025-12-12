'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { contentApi } from '@/lib/api/admin';
import { Button } from '@/components/admin/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function ContentManagementPage() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await contentApi.list({ page, limit: 20, search });
      setContent(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await contentApi.delete(id);
        fetchContent();
      } catch (error) {
        console.error('Failed to delete content:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage movies and series</p>
        </div>
        <Link href="/admin/content/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search content..."
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
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            item.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>{item.year || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/admin/content/${item.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
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
                  Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}
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

