"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Search,
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Star,
  Phone,
  Video,
  UserCircle,
  Bell,
  FileText,
  Download,
  CheckSquare,
  MoreVertical,
  Archive,
  Trash2,
  X,
  Calendar,
  FilePlus,
  Pill,
  ArrowLeft,
  Mic,
  Image as ImageIcon,
  Smile,
  PlusCircle,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";

// Type definitions
interface Conversation {
  id: number;
  name: string;
  avatar: string | null;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  starred: boolean;
  status: "patient" | "colleague" | "staff";
  online: boolean;
}

interface Attachment {
  id: number;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  attachments: Attachment[];
}

interface Task {
  id: number;
  title: string;
  dueDate: Date;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface AttachmentPreview {
  name: string;
  type: string;
  size: string;
  file: File;
}

interface Notification {
  id: number;
  name: string;
  message: string;
  timestamp: Date;
  status: string;
}

// Import the MessagingWidget to reuse its data and functionality
import { conversations as initialConversations } from "../dashboard/MessagingWidget";

const MessagingPage = () => {
  // State for conversations (initialized from the widget data)
  const [conversations, setConversations] = useState<Conversation[]>(
    initialConversations || [
      {
        id: 1,
        name: "Emma Wilson",
        avatar: null,
        lastMessage: "Thank you for the prescription refill, Dr. Smith.",
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        unread: true,
        starred: false,
        status: "patient" as const,
        online: false,
      },
      {
        id: 2,
        name: "Dr. Jessica Lee",
        avatar: null,
        lastMessage: "Could you review the lab results for patient #1042?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unread: true,
        starred: true,
        status: "colleague" as const,
        online: true,
      },
      {
        id: 3,
        name: "Michael Rodriguez",
        avatar: null,
        lastMessage:
          "Is there anything I should do before my appointment tomorrow?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        unread: false,
        starred: false,
        status: "patient" as const,
        online: false,
      },
      {
        id: 4,
        name: "Nurse Thompson",
        avatar: null,
        lastMessage: "Patient in room 3 is ready for you",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        unread: false,
        starred: false,
        status: "staff" as const,
        online: true,
      },
      {
        id: 5,
        name: "David Chen",
        avatar: null,
        lastMessage:
          "My symptoms have improved since starting the new medication",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unread: false,
        starred: false,
        status: "patient" as const,
        online: false,
      },
    ]
  );

  // Mock message history for selected conversation
  const [messageHistory, setMessageHistory] = useState<
    Record<number, Message[]>
  >({});

  // UI state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showAttachments, setShowAttachments] = useState<boolean>(false);
  const [showTaskPanel, setShowTaskPanel] = useState<boolean>(false);
  const [showAIAssistant, setShowAIAssistant] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [attachmentPreview, setAttachmentPreview] =
    useState<AttachmentPreview | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  // Refs
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize message history for each conversation if not already present
  useEffect(() => {
    const initialMessageHistory: Record<number, Message[]> = {};

    conversations.forEach((conv) => {
      if (!messageHistory[conv.id]) {
        initialMessageHistory[conv.id] = [
          {
            id: 1,
            sender: conv.name,
            content: conv.lastMessage,
            timestamp: conv.timestamp,
            status: "delivered",
            attachments: [],
          },
        ];

        // Add some mock message history for the first conversation
        if (conv.id === 1) {
          initialMessageHistory[conv.id] = [
            {
              id: 1,
              sender: "You",
              content: "Hello Emma, how are you feeling today?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
              status: "read",
              attachments: [],
            },
            {
              id: 2,
              sender: "Emma Wilson",
              content:
                "I'm feeling much better, Dr. Smith. The new medication seems to be working well.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
              status: "delivered",
              attachments: [],
            },
            {
              id: 3,
              sender: "You",
              content:
                "That's great to hear! Any side effects I should know about?",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
              status: "read",
              attachments: [],
            },
            {
              id: 4,
              sender: "Emma Wilson",
              content:
                "Just a bit of drowsiness in the morning, but it goes away after breakfast.",
              timestamp: new Date(Date.now() - 1000 * 60 * 45),
              status: "delivered",
              attachments: [],
            },
            {
              id: 5,
              sender: "Emma Wilson",
              content:
                "I've also been tracking my blood pressure as you suggested.",
              timestamp: new Date(Date.now() - 1000 * 60 * 44),
              status: "delivered",
              attachments: [
                {
                  id: 1,
                  name: "blood_pressure_log.pdf",
                  type: "pdf",
                  size: "245 KB",
                  url: "#",
                },
              ],
            },
            {
              id: 6,
              sender: "You",
              content:
                "Perfect. I'll review your blood pressure log and we can discuss it at your next appointment.",
              timestamp: new Date(Date.now() - 1000 * 60 * 30),
              status: "read",
              attachments: [],
            },
            {
              id: 7,
              sender: "Emma Wilson",
              content: "Thank you for the prescription refill, Dr. Smith.",
              timestamp: new Date(Date.now() - 1000 * 60 * 15),
              status: "delivered",
              attachments: [],
            },
          ];
        }
      }
    });

    if (Object.keys(initialMessageHistory).length > 0) {
      setMessageHistory((prev) => ({ ...prev, ...initialMessageHistory }));
    }
  }, [conversations, messageHistory]);

  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation, messageHistory]);

  // Generate AI suggestions based on conversation context
  useEffect(() => {
    if (selectedConversation && replyText.length > 0) {
      const mockSuggestions = [
        "Would you like to schedule a follow-up appointment?",
        "I can send you a prescription refill if needed.",
        "Let me know if you have any questions about your medication.",
      ];

      setAiSuggestions(mockSuggestions);
      setShowAIAssistant(true);
    } else {
      setAiSuggestions([]);
      setShowAIAssistant(false);
    }
  }, [replyText, selectedConversation]);

  // Filter conversations based on search and active filter
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "unread") return matchesSearch && conversation.unread;
    if (activeFilter === "starred")
      return matchesSearch && conversation.starred;
    if (activeFilter === "patients")
      return matchesSearch && conversation.status === "patient";
    if (activeFilter === "staff")
      return (
        matchesSearch &&
        (conversation.status === "colleague" || conversation.status === "staff")
      );

    return matchesSearch;
  });

  // Mark conversation as read
  const markAsRead = (id: number) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === id ? { ...conv, unread: false } : conv
      )
    );
  };

  // Toggle star status
  const toggleStar = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(
      conversations.map((conv) =>
        conv.id === id ? { ...conv, starred: !conv.starred } : conv
      )
    );
  };

  // Send a reply
  const sendReply = () => {
    if (!replyText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: messageHistory[selectedConversation.id]?.length + 1 || 1,
      sender: "You",
      content: replyText,
      timestamp: new Date(),
      status: "sent",
      attachments: [],
    };

    // Update message history
    setMessageHistory((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] || []),
        newMessage,
      ],
    }));

    // Update conversation preview
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: "You: " + replyText,
              timestamp: new Date(),
              unread: false,
            }
          : conv
      )
    );

    setReplyText("");
    setShowAIAssistant(false);

    // Simulate reply after a delay (for demo purposes)
    if (Math.random() > 0.5) {
      setIsTyping(true);

      setTimeout(() => {
        const autoReply: Message = {
          id: messageHistory[selectedConversation.id]?.length + 2 || 2,
          sender: selectedConversation.name,
          content: "Thanks for your message. I will get back to you soon.",
          timestamp: new Date(),
          status: "delivered",
          attachments: [],
        };

        setMessageHistory((prev) => ({
          ...prev,
          [selectedConversation.id]: [
            ...(prev[selectedConversation.id] || []),
            autoReply,
          ],
        }));

        setConversations(
          conversations.map((conv) =>
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  lastMessage: autoReply.content,
                  timestamp: new Date(),
                }
              : conv
          )
        );

        setIsTyping(false);
      }, 3000);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the file before sending
    setAttachmentPreview({
      name: file.name,
      type: file.type.split("/")[0],
      size: `${Math.round(file.size / 1024)} KB`,
      file,
    });
  };

  // Send attachment
  const sendAttachment = () => {
    if (!attachmentPreview || !selectedConversation) return;

    const newMessage: Message = {
      id: messageHistory[selectedConversation.id]?.length + 1 || 1,
      sender: "You",
      content: "I've sent you an attachment.",
      timestamp: new Date(),
      status: "sent",
      attachments: [
        {
          id: 1,
          name: attachmentPreview.name,
          type: attachmentPreview.type,
          size: attachmentPreview.size,
          url: URL.createObjectURL(attachmentPreview.file),
        },
      ],
    };

    // Update message history
    setMessageHistory((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] || []),
        newMessage,
      ],
    }));

    // Update conversation preview
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: "You: Attachment - " + attachmentPreview.name,
              timestamp: new Date(),
              unread: false,
            }
          : conv
      )
    );

    setAttachmentPreview(null);
  };

  // Cancel attachment
  const cancelAttachment = () => {
    setAttachmentPreview(null);
  };

  // Apply AI suggestion
  const applySuggestion = (suggestion: string) => {
    setReplyText(suggestion);
    setShowAIAssistant(false);
  };

  // Get avatar initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "patient":
        return "bg-blue-100 text-blue-800";
      case "colleague":
        return "bg-purple-100 text-purple-800";
      case "staff":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get message status icon
  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check size={14} className="text-gray-400" />;
      case "delivered":
        return <CheckCheck size={14} className="text-gray-400" />;
      case "read":
        return <CheckCircle size={14} className="text-[#006D77]" />;
      default:
        return null;
    }
  };

  // Format timestamp
  const formatMessageTime = (timestamp: Date) => {
    return format(timestamp, "h:mm a");
  };

  // Get attachment icon
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon size={20} />;
      case "pdf":
        return <FileText size={20} />;
      default:
        return <Paperclip size={20} />;
    }
  };

  // Mock tasks related to the selected conversation
  const getTasks = (): Task[] => {
    if (!selectedConversation) return [];

    if (selectedConversation.status === "patient") {
      return [
        {
          id: 1,
          title: `Review ${selectedConversation.name}'s lab results`,
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
          priority: "high",
          completed: false,
        },
        {
          id: 2,
          title: `Schedule follow-up appointment with ${selectedConversation.name}`,
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
          priority: "medium",
          completed: false,
        },
      ];
    }

    return [
      {
        id: 1,
        title: `Respond to ${selectedConversation.name}'s message`,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
        priority: "medium",
        completed: false,
      },
    ];
  };

  // Get all attachments from the conversation
  const getAllAttachments = () => {
    if (!selectedConversation || !messageHistory[selectedConversation.id])
      return [];

    return messageHistory[selectedConversation.id]
      .filter(
        (message: Message) =>
          message.attachments && message.attachments.length > 0
      )
      .flatMap((message: Message) =>
        message.attachments.map((attachment: Attachment) => ({
          ...attachment,
          sender: message.sender,
          timestamp: message.timestamp,
        }))
      );
  };

  // Get unread notifications
  const getUnreadNotifications = (): Notification[] => {
    return conversations
      .filter((conv) => conv.unread)
      .map((conv) => ({
        id: conv.id,
        name: conv.name,
        message: conv.lastMessage,
        timestamp: conv.timestamp,
        status: conv.status,
      }));
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId: number) => {
    // In a real app, this would update the task in the database
    console.log(`Toggling task completion for task ${taskId}`);
  };

  // Create a new task
  const createTask = (title: string) => {
    // In a real app, this would create a new task in the database
    console.log(`Creating new task: ${title}`);
  };

  // Archive conversation
  const archiveConversation = (id: number) => {
    // In a real app, this would archive the conversation
    setConversations(conversations.filter((conv) => conv.id !== id));
    setShowActionMenu(null);
  };

  // Delete conversation
  const deleteConversation = (id: number) => {
    // In a real app, this would delete the conversation
    setConversations(conversations.filter((conv) => conv.id !== id));
    setShowActionMenu(null);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex overflow-hidden">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#006D77] to-[#00858F]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white flex items-center">
              <MessageCircle className="mr-3" size={24} />
              Messages
            </h1>
            <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors">
              <PlusCircle size={20} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full p-3 pl-10 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All", count: conversations.length },
              {
                key: "unread",
                label: "Unread",
                count: conversations.filter((c) => c.unread).length,
              },
              {
                key: "starred",
                label: "Starred",
                count: conversations.filter((c) => c.starred).length,
              },
              {
                key: "patients",
                label: "Patients",
                count: conversations.filter((c) => c.status === "patient")
                  .length,
              },
              {
                key: "staff",
                label: "Staff",
                count: conversations.filter(
                  (c) => c.status === "colleague" || c.status === "staff"
                ).length,
              },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.key
                    ? "bg-[#006D77] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}
                {filter.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                      activeFilter === filter.key
                        ? "bg-white/20"
                        : "bg-gray-300"
                    }`}
                  >
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative p-4 m-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedConversation?.id === conversation.id
                      ? "bg-gradient-to-r from-[#006D77]/10 to-[#006D77]/5 border-2 border-[#006D77]/20 shadow-lg"
                      : "bg-white hover:bg-gray-50 border border-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    markAsRead(conversation.id);
                    setShowActionMenu(null);
                  }}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full overflow-hidden flex items-center justify-center font-semibold text-gray-600 shadow-sm">
                        {conversation.avatar ? (
                          <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(conversation.name)
                        )}
                      </div>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                      )}
                      {conversation.unread && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#006D77] rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => toggleStar(conversation.id, e)}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <Star
                              size={14}
                              fill={conversation.starred ? "#FCD34D" : "none"}
                              className={
                                conversation.starred
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }
                            />
                          </button>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(conversation.timestamp, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            conversation.status
                          )}`}
                        >
                          {conversation.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 truncate mt-2 leading-relaxed">
                        {conversation.lastMessage}
                      </p>
                    </div>

                    {/* Action Menu */}
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-gray-200 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(
                          showActionMenu === conversation.id
                            ? null
                            : conversation.id
                        );
                      }}
                    >
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>

                    {/* Action Menu Dropdown */}
                    {showActionMenu === conversation.id && (
                      <div className="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-xl z-20 w-44 py-2">
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(conversation.id);
                            setShowActionMenu(null);
                          }}
                        >
                          <Check size={16} className="mr-3 text-gray-400" />
                          Mark as read
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveConversation(conversation.id);
                          }}
                        >
                          <Archive size={16} className="mr-3 text-gray-400" />
                          Archive
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conversation.id);
                          }}
                        >
                          <Trash2 size={16} className="mr-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No conversations
              </h3>
              <p className="text-gray-500 text-center">
                Start a new conversation to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Messaging Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft size={20} />
                  </button>

                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full overflow-hidden flex items-center justify-center font-semibold text-gray-600">
                      {selectedConversation.avatar ? (
                        <img
                          src={selectedConversation.avatar}
                          alt={selectedConversation.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(selectedConversation.name)
                      )}
                    </div>
                    {selectedConversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <h2 className="font-semibold text-lg text-gray-900">
                      {selectedConversation.name}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center">
                      {selectedConversation.online ? (
                        <>
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Online now
                        </>
                      ) : (
                        `Last seen ${formatDistanceToNow(
                          selectedConversation.timestamp,
                          { addSuffix: true }
                        )}`
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button className="p-3 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
                    <Phone size={20} />
                  </button>
                  <button className="p-3 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
                    <Video size={20} />
                  </button>
                  {selectedConversation.status === "patient" && (
                    <Link
                      href={`/Doctor/Patients/${selectedConversation.id}`}
                      className="p-3 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <UserCircle size={20} />
                    </Link>
                  )}

                  {/* Info Panel Toggles */}
                  <div className="flex items-center space-x-1 ml-4 border-l pl-4">
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        showNotifications
                          ? "bg-[#006D77] text-white"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <Bell size={18} />
                      {getUnreadNotifications().length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        showAttachments
                          ? "bg-[#006D77] text-white"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setShowAttachments(!showAttachments)}
                    >
                      <FileText size={18} />
                    </button>
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        showTaskPanel
                          ? "bg-[#006D77] text-white"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setShowTaskPanel(!showTaskPanel)}
                    >
                      <CheckSquare size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white p-6 space-y-4">
              {messageHistory[selectedConversation.id]?.map(
                (message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "You" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.sender !== "You" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium text-gray-600 mr-3 mt-2 flex-shrink-0">
                        {getInitials(message.sender)}
                      </div>
                    )}

                    <div
                      className={`max-w-md lg:max-w-lg ${
                        message.sender === "You"
                          ? "bg-gradient-to-r from-[#006D77] to-[#00858F] text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      } rounded-2xl px-4 py-3 shadow-sm`}
                    >
                      <div className="space-y-2">
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>

                        {/* Attachments */}
                        {message.attachments?.length > 0 && (
                          <div className="space-y-2 mt-3">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className={`flex items-center p-3 rounded-lg ${
                                  message.sender === "You"
                                    ? "bg-white/20"
                                    : "bg-gray-50 border"
                                }`}
                              >
                                <div
                                  className={`p-2 rounded-lg mr-3 ${
                                    message.sender === "You"
                                      ? "bg-white/20"
                                      : "bg-gray-100"
                                  }`}
                                >
                                  {getAttachmentIcon(attachment.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs opacity-70">
                                    {attachment.size}
                                  </p>
                                </div>
                                <a
                                  href={attachment.url}
                                  download
                                  className={`p-2 rounded-lg transition-colors ${
                                    message.sender === "You"
                                      ? "hover:bg-white/20 text-white"
                                      : "hover:bg-gray-200 text-[#006D77]"
                                  }`}
                                >
                                  <Download size={16} />
                                </a>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Message Meta */}
                        <div
                          className={`flex items-center justify-end space-x-2 text-xs mt-2 ${
                            message.sender === "You"
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          <span>{formatMessageTime(message.timestamp)}</span>
                          {message.sender === "You" && (
                            <span>{getMessageStatusIcon(message.status)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium text-gray-600">
                    {getInitials(selectedConversation.name)}
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>

            {/* AI Assistant */}
            {showAIAssistant && aiSuggestions.length > 0 && (
              <div className="mx-6 mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-center mb-3">
                  <Sparkles size={18} className="text-[#006D77] mr-2" />
                  <h4 className="font-medium text-[#006D77]">AI Suggestions</h4>
                </div>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 text-sm transition-colors"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Attachment Preview */}
            {attachmentPreview && (
              <div className="mx-6 mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                      {getAttachmentIcon(attachmentPreview.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {attachmentPreview.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {attachmentPreview.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={cancelAttachment}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={sendAttachment}
                      className="p-2 text-[#006D77] hover:bg-[#006D77]/10 rounded-lg transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-6">
              <div className="flex items-end space-x-3">
                <button
                  className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={20} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </button>

                <div className="flex-1 relative">
                  <textarea
                    placeholder="Type your message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-4 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#006D77]/20 focus:border-[#006D77] resize-none bg-gray-50"
                    rows={1}
                    style={{ minHeight: "56px", maxHeight: "120px" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendReply();
                      }
                    }}
                  />
                  <button
                    className="absolute right-3 bottom-3 p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile size={18} />
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                    onClick={() => {
                      /* Voice recording functionality */
                    }}
                  >
                    <Mic size={20} />
                  </button>
                  <button
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      replyText.trim() || attachmentPreview
                        ? "bg-gradient-to-r from-[#006D77] to-[#00858F] text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={sendReply}
                    disabled={!replyText.trim() && !attachmentPreview}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center">
                  <Calendar size={16} className="mr-2" /> Schedule Appointment
                </button>
                <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center">
                  <FilePlus size={16} className="mr-2" /> Send Document
                </button>
                <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center">
                  <Pill size={16} className="mr-2" /> Prescription
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
            <div className="w-24 h-24 bg-gradient-to-br from-[#006D77]/10 to-[#006D77]/5 rounded-full flex items-center justify-center mb-6">
              <MessageCircle size={40} className="text-[#006D77]" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Welcome to Messages
            </h3>
            <p className="text-gray-500 text-center max-w-md leading-relaxed mb-6">
              Select a conversation from the sidebar to start communicating with
              your patients and colleagues.
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-[#006D77] to-[#00858F] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center">
              <PlusCircle size={20} className="mr-2" />
              Start New Conversation
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar - Info Panel */}
      {selectedConversation &&
        (showNotifications || showAttachments || showTaskPanel) && (
          <div className="w-80 bg-white border-l border-gray-200 shadow-xl overflow-y-auto">
            {/* Notifications Panel */}
            {showNotifications && (
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Bell size={20} className="mr-3 text-blue-600" />
                      Notifications
                    </h3>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => {
                        setConversations(
                          conversations.map((conv) => ({
                            ...conv,
                            unread: false,
                          }))
                        );
                      }}
                    >
                      Mark all read
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {getUnreadNotifications().length > 0 ? (
                    <div className="space-y-3">
                      {getUnreadNotifications().map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl cursor-pointer hover:shadow-md transition-all"
                          onClick={() => {
                            const conversation = conversations.find(
                              (c) => c.id === notification.id
                            );
                            if (conversation) {
                              setSelectedConversation(conversation);
                              markAsRead(conversation.id);
                              setShowNotifications(false);
                            }
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                              {getInitials(notification.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900">
                                {notification.name}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatDistanceToNow(notification.timestamp, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Bell size={32} className="text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        All caught up!
                      </h4>
                      <p className="text-gray-500 text-center">
                        No unread notifications
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attachments Panel */}
            {showAttachments && (
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <FileText size={20} className="mr-3 text-green-600" />
                    Shared Files
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {getAllAttachments().length > 0 ? (
                    <div className="space-y-3">
                      {getAllAttachments().map((attachment, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gray-100 rounded-lg">
                              {getAttachmentIcon(attachment.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">
                                {attachment.name}
                              </h4>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm text-gray-500">
                                  {attachment.size}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {format(attachment.timestamp, "MMM d, yyyy")}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Shared by {attachment.sender}
                              </p>
                            </div>
                            <a
                              href={attachment.url}
                              download
                              className="p-2 text-[#006D77] hover:bg-[#006D77]/10 rounded-lg transition-colors"
                            >
                              <Download size={18} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileText size={32} className="text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        No shared files
                      </h4>
                      <p className="text-gray-500 text-center">
                        Files shared in this conversation will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tasks Panel */}
            {showTaskPanel && (
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <CheckSquare size={20} className="mr-3 text-purple-600" />
                      Related Tasks
                    </h3>
                    <button
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center"
                      onClick={() => {
                        const taskTitle = `Follow up with ${selectedConversation.name}`;
                        createTask(taskTitle);
                      }}
                    >
                      <PlusCircle size={16} className="mr-1" />
                      New Task
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {getTasks().length > 0 ? (
                    <div className="space-y-3">
                      {getTasks().map((task) => (
                        <div
                          key={task.id}
                          className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
                        >
                          <div className="flex items-start space-x-3">
                            <button
                              className={`mt-1 p-1 rounded-full transition-colors ${
                                task.completed
                                  ? "text-green-500"
                                  : "text-gray-400 hover:text-[#006D77]"
                              }`}
                              onClick={() => toggleTaskCompletion(task.id)}
                            >
                              {task.completed ? (
                                <CheckCircle size={20} />
                              ) : (
                                <div className="w-5 h-5 border-2 border-current rounded-full"></div>
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`font-medium ${
                                  task.completed
                                    ? "line-through text-gray-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {task.title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-2">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    task.priority === "high"
                                      ? "bg-red-100 text-red-700"
                                      : task.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {task.priority}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Due: {format(task.dueDate, "MMM d, yyyy")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <CheckSquare size={32} className="text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        No tasks yet
                      </h4>
                      <p className="text-gray-500 text-center mb-4">
                        Create tasks related to this conversation
                      </p>
                      <button
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center"
                        onClick={() => {
                          const taskTitle = `Follow up with ${selectedConversation.name}`;
                          createTask(taskTitle);
                        }}
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Create Task
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default MessagingPage;
