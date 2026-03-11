import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTimes, FaCircle } from 'react-icons/fa';
import { colors } from '../../../constants/colors';
import { useChat, useMissionChat } from '../hooks/useChat';
import { useAuth } from '../../../context/AuthContext';

const ChatModal = ({ isOpen, onClose, missionId, missionTitle, t }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const { conversation, isLoading: conversationLoading, getOrCreateConversation } = useMissionChat(missionId);
  const { 
    messages, 
    isLoading: messagesLoading, 
    isConnected, 
    sendMessage 
  } = useChat(conversation?.id);

  // Get conversation when modal opens
  useEffect(() => {
    if (isOpen && missionId) {
      getOrCreateConversation();
    }
  }, [isOpen, missionId, getOrCreateConversation]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden" style={{ height: '600px' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200" style={{ backgroundColor: colors.sectionGray }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {missionTitle || t('chat.chat')}
              </h3>
              <div className="flex items-center gap-1">
                <FaCircle 
                  className={`w-2 h-2 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} 
                />
                <span className="text-xs text-gray-500">
                  {isConnected ? t('chat.connected') : t('chat.connecting')}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
          {conversationLoading || messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.linkHover }}></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>{t('chat.noMessages') || 'No messages yet'}</p>
              <p className="text-sm">{t('chat.startConversation') || 'Start the conversation!'}</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="flex items-center justify-center my-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {formatDate(date)}
                  </span>
                </div>
                {dateMessages.map((msg) => {
                  const isOwnMessage = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                        style={isOwnMessage ? { backgroundColor: colors.linkHover } : {}}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        <div className={`flex items-center justify-end gap-2 mt-1 ${isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
                          <span className="text-xs">{formatTime(msg.createdAt)}</span>
                          {isOwnMessage && msg.isRead && (
                            <span className="text-xs">{t('chat.read') || '✓✓'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('chat.typeMessage') || 'Type a message...'}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{ focusRingColor: colors.linkHover }}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.linkHover }}
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
