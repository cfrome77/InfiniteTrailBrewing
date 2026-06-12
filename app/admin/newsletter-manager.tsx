"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Users, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getSubscriberCount, sendNewsletter, getResendStats } from "@/app/actions/send-newsletter";

interface Post {
    _id: string;
    title: string;
    date: string;
    is_published: boolean;
    visibility?: string;
}

export function NewsletterManager({ posts }: { posts: Post[] }) {
    const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
    const [resendStats, setResendStats] = useState<any>(null);
    const [isLoadingCount, setIsLoadingCount] = useState(true);
    const [isSending, setIsSending] = useState<string | null>(null);
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        async function fetchData() {
            const [count, stats] = await Promise.all([
                getSubscriberCount(),
                getResendStats()
            ]);
            setSubscriberCount(count);
            setResendStats(stats);
            setIsLoadingCount(false);
        }
        fetchData();
    }, []);

    const handleSend = async (postId: string) => {
        if (!confirm("Are you sure you want to send this post as a newsletter to ALL subscribers?")) return;

        setIsSending(postId);
        setStatus(null);

        const result = await sendNewsletter(postId);

        setStatus(result);
        setIsSending(null);
    };

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-forest text-tan border-tan/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                        <Users className="h-4 w-4 text-tan/50" />
                    </CardHeader>
                    <CardContent>
                        {isLoadingCount ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <div className="text-4xl font-serif">{subscriberCount}</div>
                        )}
                        <p className="text-xs text-tan/50 mt-1">People on the trail list</p>
                    </CardContent>
                </Card>

                <Card className="border-tan/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                        <Mail className="h-4 w-4 text-forest/50" />
                    </CardHeader>
                    <CardContent>
                        {status ? (
                            <div className={`flex items-start gap-2 p-3 rounded-md text-sm mb-4 ${status.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {status.success ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
                                <span>{status.message}</span>
                            </div>
                        ) : null}

                        <div className="space-y-2">
                            {resendStats?.recentEmails?.map((email: any) => (
                                <div key={email.id} className="text-xs flex justify-between border-b border-tan/10 pb-1">
                                    <span title={email.subject} className="truncate max-w-[150px] font-medium">{email.subject}</span>
                                    <span className="text-forest/40">{new Date(email.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                            {!resendStats?.recentEmails?.length && (
                                <div className="text-xs text-forest/40 italic">No recent campaigns.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-tan/20">
                <CardHeader>
                    <CardTitle className="font-serif text-2xl">Recent Posts</CardTitle>
                    <CardDescription>Select a published post to send as a newsletter broadcast.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y divide-tan/10">
                        {posts.filter(p => p.is_published && (p.visibility === 'newsletter' || p.visibility === 'both' || !p.visibility)).map(post => (
                            <div key={post._id} className="py-4 flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-medium text-forest">{post.title}</h4>
                                    <p className="text-xs text-forest/50">{new Date(post.date).toLocaleDateString()}</p>
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-forest text-tan hover:bg-forest/90"
                                    onClick={() => handleSend(post._id)}
                                    disabled={isSending !== null}
                                >
                                    {isSending === post._id ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4 mr-2" />
                                    )}
                                    Send Newsletter
                                </Button>
                            </div>
                        ))}
                        {posts.filter(p => p.is_published).length === 0 && (
                            <div className="py-8 text-center text-forest/40 italic">
                                No published posts found to send.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
