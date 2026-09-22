'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Conversation, ChatMessage } from '../../types';
import {
  MessageSquare,
  Search,
  Filter,
  Bot,
  UserCheck,
  ShieldAlert,
  Send,
  Sparkles,
  Globe,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  User,
  ArrowRight,
  PauseCircle,
  PlayCircle,
  Clock
} from 'lucide-react';

export const ConversationsModule: React.FC = () => {
  const { conversations, properties, addToast } = useApp();
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [filterTab, setFilterTab] = useState<'all' | 'needs_approval' | 'waiting_for_human' | 'ai_active'>('all');
  const [replyText, setReplyText] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const filteredList = conversations.filter((c) => {
    if (filterTab === 'needs_approval') return c.requiresApproval;
    if (filterTab === 'waiting_for_human') return c.status === 'waiting_for_human';
    if (filterTab === 'ai_active') return c.isAiActive;
    return true;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      senderName: 'Tariq Mahmood (Agent)',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryStatus: 'delivered'
    };

    activeConv.messages.push(newMsg);
    activeConv.lastMessage = replyText;
    activeConv.lastMessageTime = newMsg.timestamp;

    setReplyText('');
    addToast({
      type: 'success',
      title: 'Message Sent',
      message: `Message delivered to ${activeConv.customerName} via ${activeConv.channel}.`
    });
  };

  const handleToggleHandoff = () => {
    if (!activeConv) return;
    activeConv.isAiActive = !activeConv.isAiActive;
    activeConv.status = activeConv.isAiActive ? 'active' : 'waiting_for_human';
    addToast({
      type: 'info',
      title: activeConv.isAiActive ? 'AI Assistant Resumed' : 'Human Agent Takeover Activated',
      message: activeConv.isAiActive
        ? 'EstateFlow AI will respond to customer inquiries.'
        : 'AI paused. Human agent Tariq Mahmood is in control.'
    });
  };

  return (
    <div className="space-y-4 h-[calc(100vh-6.5rem)] flex flex-col">
      {/* Module Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Omnichannel AI & Human Inbox
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            WhatsApp Business, Website Chat, Facebook & Property Portal Communications
          </p>
        </div>

        {/* Quick Filter tabs */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Inboxes' },
            { id: 'needs_approval', label: 'Needs Approval', badge: '1' },
            { id: 'waiting_for_human', label: 'Human Takeover', badge: '1' },
            { id: 'ai_active', label: 'AI Active' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                filterTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* THREE-COLUMN INBOX LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden min-h-0">
        {/* COLUMN 1: Conversation List (3 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredList.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-l-4 border-purple-600'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{conv.customerName}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageTime}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-2">{conv.lastMessage}</p>

                  <div className="flex items-center justify-between text-[10px]">
                    <Badge variant={conv.channel === 'whatsapp' ? 'success' : 'info'}>{conv.channel}</Badge>
                    {conv.isAiActive ? (
                      <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
                        <Bot className="w-3 h-3" /> AI Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-500 font-bold">
                        <UserCheck className="w-3 h-3" /> Human Agent
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: Message Workspace & Composer (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
          {activeConv ? (
            <>
              {/* Header */}
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                    {activeConv.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {activeConv.customerName}
                      <Badge variant={activeConv.isAiActive ? 'ai' : 'danger'}>
                        {activeConv.isAiActive ? 'AI Assistant Mode' : 'Human Agent Takeover'}
                      </Badge>
                    </h3>
                    <p className="text-[11px] text-slate-500">{activeConv.customerPhone} • Channel: {activeConv.channel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleHandoff}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeConv.isAiActive
                        ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-300'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    {activeConv.isAiActive ? (
                      <>
                        <PauseCircle className="w-4 h-4" /> Pause AI & Take Over
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" /> Resume AI Assistant
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-950/40">
                {activeConv.messages.map((m) => {
                  const isCustomer = m.sender === 'customer';
                  const isAi = m.sender === 'ai';

                  return (
                    <div key={m.id} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{m.senderName || m.sender}</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs space-y-2 ${
                          isCustomer
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                            : isAi
                            ? 'bg-purple-950/80 text-purple-100 border border-purple-800 rounded-tr-none shadow-md'
                            : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-tr-none shadow-sm'
                        }`}
                      >
                        <p className="leading-relaxed">{m.text}</p>

                        {/* Translation indicator if Urdu */}
                        {m.translation && (
                          <div className="pt-2 border-t border-purple-800/60 text-[11px] opacity-90 italic flex items-center gap-1">
                            <Globe className="w-3 h-3 text-purple-400" />
                            <span>EN Translation: "{m.translation.text}"</span>
                          </div>
                        )}

                        {/* Source citations for property facts */}
                        {m.citations && m.citations.length > 0 && (
                          <div className="pt-2 border-t border-purple-800/80 text-[10px] space-y-1">
                            <div className="font-bold text-purple-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Property Citation
                            </div>
                            {m.citations.map((c, idx) => (
                              <div key={idx} className="bg-purple-900/60 p-2 rounded-lg text-purple-200">
                                <div className="font-semibold">{c.propertyTitle}</div>
                                <div>{c.excerpt}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type human response or generate AI draft..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-purple-500"
                  />

                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-2">
                    <button type="button" className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5" /> Attach Listing Brochure
                    </button>
                    <span>•</span>
                    <button type="button" className="hover:text-purple-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Auto-Draft Response
                    </button>
                  </div>
                  <span>Press Enter to send</span>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">Select a conversation</div>
          )}
        </div>

        {/* COLUMN 3: Human Handoff Panel & Customer Profile (3 cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col overflow-y-auto space-y-5 shadow-sm text-xs">
          {activeConv && (
            <>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Human Handoff Summary</h3>
                <p className="text-slate-500 text-[11px]">Context for agent taking over the conversation</p>
              </div>

              {activeConv.handoffReason && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Handoff Trigger
                  </div>
                  <p className="text-[11px] leading-relaxed">{activeConv.handoffReason}</p>
                </div>
              )}

              {/* Verified Requirements */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] text-slate-400">
                  Customer Requirements
                </h4>
                <div className="space-y-1 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target City:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">Lahore</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Budget:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">PKR 25.0 Million</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type & Beds:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">3-Bed Luxury Apartment</span>
                  </div>
                </div>
              </div>

              {/* Recommended Next Action */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] text-slate-400">
                  Recommended Agent Action
                </h4>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-semibold leading-snug">
                  Confirm tomorrow 11:00 AM viewing appointment at Gulberg III with client.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
