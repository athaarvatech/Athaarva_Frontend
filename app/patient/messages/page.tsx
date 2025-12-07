"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Search, 
  PlusCircle, 
  Paperclip, 
  Send, 
  ChevronLeft, 
  Image as ImageIcon,
  FileText,
  MoreVertical,
  Phone,
  Video,
  Star,
  StarOff,
  Clock,
  Check,
  CheckCheck,
  Smile,
  X
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, formatDistanceToNow } from 'date-fns';

// Types
interface Message {
  id: string;
  sender: 'patient' | 'doctor' | 'staff';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachment?: {
    name: string;
    type: string;
    size: string;
    url?: string;
  };
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  unreadCount: number;
  isStarred: boolean;
  isOnline: boolean;
  role: string;
  messages: Message[];
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    avatar: '/avatars/dr-johnson.png',
    lastMessage: 'Your blood test results look normal. Let me know if you have any questions.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: true,
    unreadCount: 2,
    isStarred: false,
    isOnline: true,
    role: 'Cardiologist',
    messages: [
      {
        id: '101',
        sender: 'doctor',
        content: 'Hello! I hope you are feeling better today. I\'ve reviewed your test results.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: 'read'
      },
      {
        id: '102',
        sender: 'patient',
        content: 'Hi Dr. Johnson, thank you for checking. I\'m feeling much better, just a bit tired still.',
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        status: 'read'
      },
      {
        id: '103',
        sender: 'doctor',
        content: 'Your blood test results look normal. Let me know if you have any questions.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'read'
      }
    ]
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    avatar: '/avatars/dr-chen.png',
    lastMessage: 'Please make sure to take the medication as prescribed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unread: false,
    unreadCount: 0,
    isStarred: true,
    isOnline: false,
    role: 'Primary Care',
    messages: [
      {
        id: '201',
        sender: 'doctor',
        content: 'I\'ve prescribed a new medication for your hypertension.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        status: 'read',
        attachment: {
          name: 'Prescription.pdf',
          type: 'application/pdf',
          size: '156 KB'
        }
      },
      {
        id: '202',
        sender: 'patient',
        content: 'Thank you, Dr. Chen. I\'ll pick it up today. How often should I take it?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5),
        status: 'read'
      },
      {
        id: '203',
        sender: 'doctor',
        content: 'Please make sure to take the medication as prescribed.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        status: 'read'
      }
    ]
  },
  {
    id: '3',
    name: 'Front Desk',
    avatar: '/avatars/nurse-williams.png',
    lastMessage: 'Your appointment has been confirmed for tomorrow at 10:00 AM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    unread: false,
    unreadCount: 0,
    isStarred: false,
    isOnline: true,
    role: 'Hospital Staff',
    messages: [
      {
        id: '301',
        sender: 'staff',
        content: 'Hello! I wanted to confirm your appointment with Dr. Johnson.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9),
        status: 'read'
      },
      {
        id: '302',
        sender: 'patient',
        content: 'Hi, yes I can make it. What time is it again?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8.5),
        status: 'read'
      },
      {
        id: '303',
        sender: 'staff',
        content: 'Your appointment has been confirmed for tomorrow at 10:00 AM.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        status: 'read'
      }
    ]
  }
];

// Mock doctors for new message
const mockDoctors = [
  { id: 'd1', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist' },
  { id: 'd2', name: 'Dr. Michael Chen', specialty: 'Primary Care' },
  { id: 'd3', name: 'Dr. Emily Roberts', specialty: 'Dermatologist' },
  { id: 'd4', name: 'Dr. James Wilson', specialty: 'Orthopedist' },
];

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [messageText, setMessageText] = useState('');
  const [activeChatId, setActiveChatId] = useState<string | null>(selectedId || null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [newMessageDoctor, setNewMessageDoctor] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatId, conversations]);

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && conv.unread) || 
      (filter === 'starred' && conv.isStarred);
    return matchesSearch && matchesFilter;
  });

  // Get active conversation
  const activeConversation = conversations.find(conv => conv.id === activeChatId);

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffInHours < 24) {
      return format(date, 'h:mm a');
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChatId) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      content: messageText,
      timestamp: new Date(),
      status: 'sending'
    };

    // Update conversations
    setConversations(prev => prev.map(conv => 
      conv.id === activeChatId
        ? {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: messageText,
            timestamp: new Date()
          }
        : conv
    ));

    setMessageText('');

    // Simulate sending
    setTimeout(() => {
      setConversations(prev => prev.map(conv => 
        conv.id === activeChatId
          ? {
              ...conv,
              messages: conv.messages.map(msg => 
                msg.id === newMessage.id ? { ...msg, status: 'sent' as const } : msg
              )
            }
          : conv
      ));
    }, 500);

    // Simulate delivery
    setTimeout(() => {
      setConversations(prev => prev.map(conv => 
        conv.id === activeChatId
          ? {
              ...conv,
              messages: conv.messages.map(msg => 
                msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
              )
            }
          : conv
      ));
    }, 1500);
  };

  // Toggle star
  const toggleStar = (id: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === id ? { ...conv, isStarred: !conv.isStarred } : conv
    ));
  };

  // Mark as read
  const markAsRead = (id: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === id ? { ...conv, unread: false, unreadCount: 0 } : conv
    ));
  };

  // Create new conversation
  const handleCreateConversation = async () => {
    if (!newMessageDoctor || !newMessageContent.trim()) return;
    
    setIsSending(true);
    
    const doctor = mockDoctors.find(d => d.id === newMessageDoctor);
    if (!doctor) return;

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      name: doctor.name,
      avatar: '',
      lastMessage: newMessageContent,
      timestamp: new Date(),
      unread: false,
      unreadCount: 0,
      isStarred: false,
      isOnline: Math.random() > 0.5,
      role: doctor.specialty,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'patient',
          content: newMessageSubject ? `**${newMessageSubject}**\n\n${newMessageContent}` : newMessageContent,
          timestamp: new Date(),
          status: 'sent'
        }
      ]
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setConversations(prev => [newConversation, ...prev]);
    setActiveChatId(newConversation.id);
    setShowNewMessageDialog(false);
    setNewMessageDoctor('');
    setNewMessageSubject('');
    setNewMessageContent('');
    setIsSending(false);
  };

  // Message status icon
  const MessageStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 opacity-70" />;
      case 'sent':
        return <Check className="h-3 w-3 opacity-70" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 opacity-70" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col md:flex-row h-full overflow-hidden border rounded-lg bg-white">
        {/* Sidebar */}
        <div className={`w-full md:w-80 lg:w-96 border-r flex flex-col ${
          activeChatId ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-[#006D77]">Messages</h1>
              <Button 
                className="bg-[#006D77] hover:bg-[#00585F]"
                onClick={() => setShowNewMessageDialog(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter tabs */}
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Conversation List */}
          <ScrollArea className="flex-1">
            {filteredConversations.length > 0 ? (
              <div className="p-2">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      conv.id === activeChatId
                        ? 'bg-[#006D77]/10 border border-[#006D77]/20'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setActiveChatId(conv.id);
                      markAsRead(conv.id);
                      router.push(`/patient/messages?id=${conv.id}`, { scroll: false });
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conv.avatar} alt={conv.name} />
                          <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conv.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`font-medium truncate ${conv.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                            {conv.name}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {conv.isStarred && (
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(conv.timestamp)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{conv.role}</p>
                        <p className={`text-sm truncate ${conv.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                      
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-[#006D77] text-white h-5 px-1.5 min-w-[20px] justify-center">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No conversations found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowNewMessageDialog(true)}
                >
                  Start a new conversation
                </Button>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {activeChatId && activeConversation ? (
          <div className="flex-1 flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => {
                    setActiveChatId(null);
                    router.push('/patient/messages', { scroll: false });
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                  <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="font-medium">{activeConversation.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{activeConversation.role}</span>
                    {activeConversation.isOnline && (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-xs">
                        Online
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toggleStar(activeConversation.id)}>
                      {activeConversation.isStarred ? (
                        <>
                          <StarOff className="h-4 w-4 mr-2" />
                          Unstar
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Star
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender !== 'patient' && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={activeConversation.avatar} />
                        <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                        message.sender === 'patient'
                          ? 'bg-[#006D77] text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      
                      {message.attachment && (
                        <div className={`mt-2 p-2 rounded flex items-center gap-2 text-sm ${
                          message.sender === 'patient' ? 'bg-white/20' : 'bg-white'
                        }`}>
                          <FileText className="h-4 w-4" />
                          <span>{message.attachment.name}</span>
                          <span className="text-xs opacity-70">{message.attachment.size}</span>
                        </div>
                      )}
                      
                      <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                        message.sender === 'patient' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        <span>{format(message.timestamp, 'h:mm a')}</span>
                        {message.sender === 'patient' && <MessageStatus status={message.status} />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-5 w-5" />
                  <input type="file" ref={fileInputRef} className="hidden" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="pr-10"
                  />
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  className="bg-[#006D77] hover:bg-[#00585F]"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-medium text-gray-600 mb-2">
                Select a conversation
              </h2>
              <p className="text-gray-500 mb-4">
                Choose a conversation or start a new one
              </p>
              <Button 
                className="bg-[#006D77] hover:bg-[#00585F]"
                onClick={() => setShowNewMessageDialog(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* New Message Dialog */}
      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Start a conversation with your healthcare provider
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label>To</Label>
              <Select value={newMessageDoctor} onValueChange={setNewMessageDoctor}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {mockDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Subject (optional)</Label>
              <Input
                placeholder="Brief subject"
                value={newMessageSubject}
                onChange={(e) => setNewMessageSubject(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Type your message..."
                value={newMessageContent}
                onChange={(e) => setNewMessageContent(e.target.value)}
                className="mt-1 min-h-[150px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#006D77] hover:bg-[#00585F]"
              onClick={handleCreateConversation}
              disabled={!newMessageDoctor || !newMessageContent.trim() || isSending}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
