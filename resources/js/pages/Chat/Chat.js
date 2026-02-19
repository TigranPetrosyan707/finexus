import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { FaPaperPlane, FaUser, FaComments } from 'react-icons/fa';
import { colors } from '../../constants/colors';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Empty from '../../components/Empty/Empty';

const Chat = () => {
  const { t } = useTranslation();
  const { userRole } = useAuth();
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);

  const chats = [];
  const messages = [];

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: colors.sectionGray }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.linkHover, transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: colors.buttonBackground, transform: 'translate(-30%, 30%)' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {t('chat.title')}
              </h1>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: `${colors.linkHover}20` }}>
                <FaComments className="w-6 h-6" style={{ color: colors.linkHover }} />
              </div>
            </div>
            <p className="text-base md:text-lg text-gray-600">
              {t('chat.subtitle')}
            </p>
          </div>
        </div>

        {chats.length === 0 ? (
          <Empty
            icon={FaComments}
            title={t('chat.noMessages') || 'No messages'}
            description={t('chat.noMessagesDescription') || 'You don\'t have any messages yet.'}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
            <div className="flex h-full">
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">{t('chat.conversations')}</h2>
                </div>
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedChat === chat.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{chat.name}</p>
                          <span className="text-xs text-gray-500">{chat.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{t(chat.lastMessageKey)}</p>
                        {chat.unread > 0 && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full text-white" style={{ backgroundColor: colors.linkHover }}>
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">
                    {chats.find(c => c.id === selectedChat)?.name}
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === userRole ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender === userRole
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                        style={msg.sender === userRole ? { backgroundColor: colors.linkHover } : {}}
                      >
                        <p className="text-sm">{t(msg.textKey)}</p>
                        <p className={`text-xs mt-1 ${msg.sender === userRole ? 'text-white/70' : 'text-gray-500'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder={t('chat.typeMessage')}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" className="flex items-center space-x-2">
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

