import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { FaPaperPlane, FaUser, FaComments } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Empty from '../../components/Empty/Empty';
import { api } from '../../utils/api';
import { useChat } from './hooks/useChat';

const Chat = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [loadingConversationByMission, setLoadingConversationByMission] = useState(false);

  const [messageDraft, setMessageDraft] = useState('');

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversationId) || null;
  }, [conversations, selectedConversationId]);

  const {
    messages,
    isLoading: messagesLoading,
    error: messagesError,
    isConnected,
    sendMessage,
  } = useChat(selectedConversationId);

  useEffect(() => {
    let cancelled = false;

    const loadConversations = async () => {
      try {
        setLoadingConversations(true);
        const data = await api.get('/api/chat/conversations');
        const list = data.conversations || [];

        if (cancelled) return;
        setConversations(list);
        if (list.length > 0 && !selectedConversationId) {
          setSelectedConversationId(list[0].id);
        }
      } catch (err) {
        console.error('Error loading conversations:', err);
      } finally {
        if (!cancelled) setLoadingConversations(false);
      }
    };

    loadConversations();
    return () => {
      cancelled = true;
    };
  }, []);

  // If user navigated from a mission card, open the related conversation immediately.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const missionId = params.get('missionId');
    if (!missionId) return;

    let cancelled = false;
    const openConversationForMission = async () => {
      try {
        setLoadingConversationByMission(true);

        const data = await api.get(`/api/chat/conversations/mission/${missionId}`);
        if (cancelled) return;

        const convoId = data?.conversation?.id;
        if (convoId) setSelectedConversationId(convoId);

        // Refresh sidebar list so the selected conversation appears.
        const listData = await api.get('/api/chat/conversations');
        if (cancelled) return;
        setConversations(listData.conversations || []);

        // Clean URL (optional).
        window.history.replaceState({}, '', window.location.pathname);
      } catch (err) {
        console.error('Error opening conversation for mission:', err);
      } finally {
        if (!cancelled) setLoadingConversationByMission(false);
      }
    };

    openConversationForMission();
    return () => {
      cancelled = true;
    };
  }, []);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const groupedMessages = useMemo(() => {
    const groups = {};
    for (const msg of messages || []) {
      const date = new Date(msg.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    }
    return groups;
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageDraft.trim()) return;
    try {
      await sendMessage(messageDraft);
      setMessageDraft('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const headerTitle =
    selectedConversation?.missionTitle ||
    selectedConversation?.otherUser?.name ||
    'Conversation';

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
          style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">{t('chat.title')}</h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <FaComments className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">{t('chat.subtitle')}</p>
          </div>
        </div>

        {loadingConversations || loadingConversationByMission ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: colors.linkHover }} />
          </div>
        ) : conversations.length === 0 && !selectedConversationId ? (
          <Empty
            icon={FaComments}
            title={t('chat.noMessages') || 'No messages'}
            description={t('chat.noMessagesDescription') || "You don't have any messages yet."}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
            <div className="flex h-full">
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">{t('chat.conversations')}</h2>
                </div>

                {conversations.map((c) => {
                  const lastTime = c.lastMessageAt ? formatTime(c.lastMessageAt) : '';
                  const lastMessageText = c.lastMessage?.message || t('chat.noMessages') || 'No messages yet';

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConversationId(c.id)}
                      className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        selectedConversationId === c.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {c.otherUser?.name || c.missionTitle || 'Conversation'}
                            </p>
                            <span className="text-xs text-gray-500">{lastTime}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{lastMessageText}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="font-semibold text-gray-900 truncate">{headerTitle}</h2>
                    <span className="text-xs text-gray-500">
                      {isConnected ? t('chat.connected') : t('chat.connecting')}
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.linkHover }} />
                    </div>
                  ) : messagesError ? (
                    <div className="text-sm text-red-600">{messagesError}</div>
                  ) : (messages || []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <p>{t('chat.noMessages') || 'No messages yet'}</p>
                      <p className="text-sm">{t('chat.startConversation') || 'Start the conversation!'}</p>
                    </div>
                  ) : (
                    Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
                      <div key={dateKey}>
                        <div className="flex items-center justify-center my-4">
                          <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            {formatDate(dateKey)}
                          </span>
                        </div>
                        {dateMessages.map((msg) => {
                          const isOwnMessage = msg.senderId === user?.id;
                          return (
                            <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  isOwnMessage ? 'text-white' : 'bg-gray-100 text-gray-900'
                                }`}
                                style={isOwnMessage ? { backgroundColor: colors.linkHover } : {}}
                              >
                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                <div className={`flex items-center justify-end gap-2 mt-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
                                  <span className="text-xs">{formatTime(msg.createdAt)}</span>
                                  {isOwnMessage && msg.isRead && <span className="text-xs">{t('chat.read') || '✓✓'}</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                  <div />
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder={t('chat.typeMessage')}
                      value={messageDraft}
                      onChange={(e) => setMessageDraft(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" className="flex items-center space-x-2" disabled={!messageDraft.trim()}>
                      <FaPaperPlane className="w-4 h-4" />
                      <span>{t('chat.send')}</span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

