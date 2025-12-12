'use client';

import { useEffect, useState } from 'react';
import { notificationsApi } from '@/lib/api/admin';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Send, Bell, Mail } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'push' as 'push' | 'email',
    userId: '',
  });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsApi.list();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await notificationsApi.create(formData);
      setFormData({ title: '', message: '', type: 'push', userId: '' });
      fetchNotifications();
      alert('Notification sent successfully!');
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600">Send and manage notifications</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send Notification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'push' | 'email',
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="push">Push Notification</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId">User ID (optional)</Label>
                <Input
                  id="userId"
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  placeholder="Leave empty for all users"
                />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                <Send className="mr-2 h-4 w-4" />
                {sending ? 'Sending...' : 'Send Notification'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : (
              <div className="space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500">No notifications sent yet</p>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 p-3"
                    >
                      {notification.type === 'push' ? (
                        <Bell className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Mail className="h-5 w-5 text-green-600" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

