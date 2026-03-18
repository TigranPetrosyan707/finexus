import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

export const useChat = (conversationId) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const pusherRef = useRef(null);
  const channelRef = useRef(null);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.get(`/api/chat/conversations/${conversationId}/messages`);
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Send a message
  const sendMessage = useCallback(async (message) => {
    if (!conversationId || !message.trim()) return;
    
    try {
      const data = await api.post(`/api/chat/conversations/${conversationId}/messages`, {
        message: message.trim(),
      });
      
      // Add the sent message to the list (optimistic update)
      setMessages((prev) => [...prev, data.message]);
      
      return data.message;
    } catch (err) {
      setError(err.message);
      console.error('Error sending message:', err);
      throw err;
    }
  }, [conversationId]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      await api.post(`/api/chat/conversations/${conversationId}/read`);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [conversationId]);

  // Set up Pusher subscription for real-time messages
  useEffect(() => {
    if (!conversationId || !user) return;

    // Initialize Pusher (will be available globally via window.Pusher or loaded via script)
    const initPusher = async () => {
      try {
        // Dynamically load Pusher if not already loaded
        if (!window.Pusher) {
          await loadPusher();
        }
        
        const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
        const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

        if (!pusherKey || !pusherCluster) {
          console.error(
            'Pusher config missing. Please set `VITE_PUSHER_APP_KEY` and `VITE_PUSHER_CLUSTER` in your .env and restart Vite.'
          );
          return;
        }
        
        if (!pusherRef.current) {
          pusherRef.current = new window.Pusher(pusherKey, {
            cluster: pusherCluster,
            authEndpoint: '/broadcasting/auth',
            auth: {
              headers: {
                'X-User-Id': user.id,
              },
            },
          });
        }

        // Subscribe to the user's private channel
        const channelName = `chat.${user.id}`;
        channelRef.current = pusherRef.current.subscribe(channelName);

        channelRef.current.bind('chat.message.sent', (data) => {
          if (data.conversationId === conversationId) {
            setMessages((prev) => {
              // Avoid duplicates
              const exists = prev.some((m) => m.id === data.message.id);
              if (exists) return prev;
              return [...prev, data.message];
            });
          }
        });

        channelRef.current.bind('pusher:subscription_succeeded', () => {
          setIsConnected(true);
        });

        channelRef.current.bind('pusher:subscription_error', (err) => {
          console.error('Pusher subscription error:', err);
          setIsConnected(false);
        });

        // Mark messages as read when receiving new messages
        markAsRead();
      } catch (err) {
        console.error('Error initializing Pusher:', err);
      }
    };

    initPusher();

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        pusherRef.current?.unsubscribe(`chat.${user.id}`);
      }
    };
  }, [conversationId, user, markAsRead]);

  // Load messages when conversationId changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    isConnected,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
  };
};

// Helper function to load Pusher dynamically
const loadPusher = () => {
  return new Promise((resolve, reject) => {
    if (window.Pusher) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.pusher.com/8.0/pusher.min.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Hook to get or create a conversation for a mission
export const useMissionChat = (missionId) => {
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOrCreateConversation = useCallback(async () => {
    if (!missionId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.get(`/api/chat/conversations/mission/${missionId}`);
      setConversation(data.conversation);
      return data.conversation;
    } catch (err) {
      setError(err.message);
      console.error('Error getting conversation:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [missionId]);

  return {
    conversation,
    isLoading,
    error,
    getOrCreateConversation,
  };
};
