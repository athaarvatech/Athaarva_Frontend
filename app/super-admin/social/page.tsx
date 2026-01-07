"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Share2,
  Plus,
  Clock,
  CheckCircle,
  Edit,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Link2,
  Calendar,
  Image as ImageIcon,
  FileText,
  Settings,
  RefreshCw,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SocialAccount {
  id: string;
  platform: string;
  account_name: string;
  account_id?: string;
  is_connected: boolean;
  last_sync_at?: string;
}

interface SocialPost {
  id: string;
  platforms: string[];
  content: string;
  media_urls: string[];
  status: string;
  scheduled_at?: string;
  published_at?: string;
  created_at: string;
}

const PLATFORMS = [
  { id: "twitter", name: "Twitter/X", icon: Twitter, color: "text-black" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "text-blue-600" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-600",
  },
];

export default function SocialMediaPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);

  // Post form state
  const [newPost, setNewPost] = useState({
    platforms: [] as string[],
    content: "",
    media_urls: "",
    schedule_at: "",
  });

  const fetchData = async () => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    setLoading(true);
    try {
      const [accountsRes, postsRes] = await Promise.all([
        fetch(`${API_BASE}/api/v2/super-admin/social/accounts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/v2/super-admin/social/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (accountsRes.ok) setAccounts(await accountsRes.json());
      if (postsRes.ok) setPosts(await postsRes.json());
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createPost = async () => {
    const token = localStorage.getItem("super_admin_token");
    if (!token) return;

    if (newPost.platforms.length === 0 || !newPost.content.trim()) {
      setError("Please select at least one platform and enter content");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/v2/super-admin/social/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platforms: newPost.platforms,
          content: newPost.content.trim(),
          media_urls: newPost.media_urls
            ? newPost.media_urls.split("\n").filter((u) => u.trim())
            : [],
          schedule_at: newPost.schedule_at || null,
        }),
      });

      if (res.ok) {
        setShowCreateDialog(false);
        setNewPost({
          platforms: [],
          content: "",
          media_urls: "",
          schedule_at: "",
        });
        fetchData();
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to create post");
      }
    } catch {
      setError("Network error");
    } finally {
      setCreating(false);
    }
  };

  const togglePlatform = (platformId: string) => {
    setNewPost((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = PLATFORMS.find((p) => p.id === platformId);
    if (!platform) return Share2;
    return platform.icon;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      scheduled: "bg-blue-100 text-blue-800",
      published: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const connectedAccounts = accounts.filter((a) => a.is_connected);
  const scheduledPosts = posts.filter((p) => p.status === "scheduled");
  const publishedPosts = posts.filter((p) => p.status === "published");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg">
            <Share2 className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Social Media Hub
            </h1>
            <p className="text-gray-500">Multi-platform social publishing</p>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Social Post</DialogTitle>
              <DialogDescription>
                Create and schedule posts across multiple platforms
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="flex gap-2">
                  {PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = newPost.platforms.includes(platform.id);
                    return (
                      <Button
                        key={platform.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={isSelected ? "" : ""}
                        onClick={() => togglePlatform(platform.id)}
                      >
                        <Icon className={`h-4 w-4 mr-1 ${platform.color}`} />
                        {platform.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  placeholder="What's on your mind?"
                  rows={4}
                />
                <p className="text-sm text-gray-500">
                  {newPost.content.length}/280 characters
                </p>
              </div>

              {/* Media URLs */}
              <div className="space-y-2">
                <Label htmlFor="media">Media URLs (one per line)</Label>
                <Textarea
                  id="media"
                  value={newPost.media_urls}
                  onChange={(e) =>
                    setNewPost({ ...newPost, media_urls: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  rows={2}
                />
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule (optional)</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={newPost.schedule_at}
                  onChange={(e) =>
                    setNewPost({ ...newPost, schedule_at: e.target.value })
                  }
                />
                <p className="text-sm text-gray-500">
                  Leave empty to save as draft
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={createPost} disabled={creating}>
                {creating ? (
                  "Creating..."
                ) : newPost.schedule_at ? (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Connected Accounts</p>
                <p className="text-3xl font-bold">{connectedAccounts.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Link2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Scheduled Posts</p>
                <p className="text-3xl font-bold text-blue-600">
                  {scheduledPosts.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-3xl font-bold text-green-600">
                  {publishedPosts.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Posts</p>
                <p className="text-3xl font-bold">{posts.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Accounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Posts</CardTitle>
              <CardDescription>
                Manage your social media content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platforms</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Media</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex gap-1">
                          {post.platforms.map((p) => {
                            const Icon = getPlatformIcon(p);
                            return (
                              <div
                                key={p}
                                className="p-1 bg-gray-100 rounded"
                                title={p}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <p className="truncate">{post.content}</p>
                      </TableCell>
                      <TableCell>
                        {post.media_urls.length > 0 ? (
                          <Badge variant="outline">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            {post.media_urls.length}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(post.status)}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {post.scheduled_at
                          ? new Date(post.scheduled_at).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {posts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500 py-8"
                      >
                        No posts yet. Create your first post!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLATFORMS.map((platform) => {
              const account = accounts.find((a) => a.platform === platform.id);
              const Icon = platform.icon;

              return (
                <Card key={platform.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon className={`h-6 w-6 ${platform.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {platform.name}
                          </CardTitle>
                          {account?.account_name && (
                            <p className="text-sm text-gray-500">
                              @{account.account_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          account?.is_connected ? "default" : "secondary"
                        }
                      >
                        {account?.is_connected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {account?.is_connected ? (
                        <>
                          <div className="text-sm text-gray-500">
                            {account.last_sync_at && (
                              <p>
                                Last sync:{" "}
                                {new Date(
                                  account.last_sync_at
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                            >
                              Disconnect
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Button className="w-full">
                          <Link2 className="h-4 w-4 mr-2" />
                          Connect {platform.name}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Alert>
            <AlertDescription>
              <strong>Note:</strong> Social media account connections require
              OAuth setup. Configure API keys in Platform Settings to enable
              account connections.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Scheduled Posts Queue */}
      {scheduledPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Scheduled Queue
            </CardTitle>
            <CardDescription>Upcoming posts to be published</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {post.platforms.map((p) => {
                        const Icon = getPlatformIcon(p);
                        return (
                          <Icon key={p} className="h-4 w-4 text-gray-600" />
                        );
                      })}
                    </div>
                    <p className="text-sm truncate max-w-md">{post.content}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {post.scheduled_at &&
                          new Date(post.scheduled_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {post.scheduled_at &&
                          new Date(post.scheduled_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
