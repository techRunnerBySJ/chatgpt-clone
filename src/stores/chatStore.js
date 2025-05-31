import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../firebaseConfig';

const getUserStorageKey = (key) => {
  const user = auth.currentUser;
  return user ? `${user.uid}_${key}` : key;
};

const useChatStore = create((set, get) => ({
  chatSessions: JSON.parse(localStorage.getItem(getUserStorageKey('chatSessions'))) || [
    { id: 1, name: 'New Chat', messages: [] },
  ],
  activeSessionId: JSON.parse(localStorage.getItem(getUserStorageKey('activeSessionId'))) || 1,

  setActiveSessionId: (id) => {
    localStorage.setItem(getUserStorageKey('activeSessionId'), JSON.stringify(id));
    set({ activeSessionId: id });
  },

  addNewChat: () => {
    const { chatSessions } = get();
    const newChatId = chatSessions.length + 1;
    const newChat = { id: newChatId, name: 'New Chat', messages: [] };
    const updatedSessions = [...chatSessions, newChat];
    localStorage.setItem(getUserStorageKey('chatSessions'), JSON.stringify(updatedSessions));
    localStorage.setItem(getUserStorageKey('activeSessionId'), JSON.stringify(newChatId));
    set({ chatSessions: updatedSessions, activeSessionId: newChatId });
  },

  updateChatName: (sessionId, name) => {
    const { chatSessions } = get();
    const updatedSessions = chatSessions.map((session) =>
      session.id === sessionId ? { ...session, name } : session
    );
    localStorage.setItem(getUserStorageKey('chatSessions'), JSON.stringify(updatedSessions));
    set({ chatSessions: updatedSessions });
  },

  addMessageToActiveChat: (message) => {
    const { chatSessions, activeSessionId } = get();
    const updatedSessions = chatSessions.map((session) => {
      if (session.id === activeSessionId) {
        // If this is the first message and the chat name is still default, update it
        const newMessages = [...session.messages, message];
        let newName = session.name;
        if (session.name === 'New Chat' && message.text) {
          // Use first 30 characters of the message as the chat name
          newName = message.text.slice(0, 30) + (message.text.length > 30 ? '...' : '');
        }
        return { ...session, messages: newMessages, name: newName };
      }
      return session;
    });
    localStorage.setItem(getUserStorageKey('chatSessions'), JSON.stringify(updatedSessions));
    set({ chatSessions: updatedSessions });
  },

  syncWithLocalStorage: () => {
    const savedSessions = JSON.parse(localStorage.getItem(getUserStorageKey('chatSessions'))) || [
      { id: 1, name: 'New Chat', messages: [] },
    ];
    const savedActiveSessionId = JSON.parse(localStorage.getItem(getUserStorageKey('activeSessionId'))) || savedSessions[0]?.id || 1;
    set({
      chatSessions: savedSessions,
      activeSessionId: savedActiveSessionId,
    });
  },
}));

// Custom hook to use chat store with React Query
export const useChatStoreWithQuery = () => {
  const queryClient = useQueryClient();
  const store = useChatStore();

  // Query for chat sessions
  const { data: chatSessions = store.chatSessions } = useQuery({
    queryKey: ['chatSessions', auth.currentUser?.uid],
    queryFn: () => {
      const savedSessions = JSON.parse(localStorage.getItem(getUserStorageKey('chatSessions'))) || [
        { id: 1, name: 'New Chat', messages: [] },
      ];
      return savedSessions;
    },
    initialData: store.chatSessions,
  });

  // Mutation for adding a new chat
  const addNewChatMutation = useMutation({
    mutationFn: () => {
      const newChatId = chatSessions.length + 1;
      const newChat = { id: newChatId, name: 'New Chat', messages: [] };
      const updatedSessions = [...chatSessions, newChat];
      localStorage.setItem(getUserStorageKey('chatSessions'), JSON.stringify(updatedSessions));
      localStorage.setItem(getUserStorageKey('activeSessionId'), JSON.stringify(newChatId));
      return { newChat, updatedSessions };
    },
    onSuccess: ({ newChat, updatedSessions }) => {
      queryClient.setQueryData(['chatSessions', auth.currentUser?.uid], updatedSessions);
      store.setActiveSessionId(newChat.id);
    },
  });

  // Mutation for adding a message
  const addMessageMutation = useMutation({
    mutationFn: ({ message, sessionId }) => {
      const updatedSessions = chatSessions.map((session) => {
        if (session.id === sessionId) {
          const newMessages = [...session.messages, message];
          let newName = session.name;
          if (session.name === 'New Chat' && message.text) {
            newName = message.text.slice(0, 30) + (message.text.length > 30 ? '...' : '');
          }
          return { ...session, messages: newMessages, name: newName };
        }
        return session;
      });
      localStorage.setItem(getUserStorageKey('chatSessions'), JSON.stringify(updatedSessions));
      return updatedSessions;
    },
    onSuccess: (updatedSessions) => {
      queryClient.setQueryData(['chatSessions', auth.currentUser?.uid], updatedSessions);
    },
  });

  return {
    ...store,
    chatSessions,
    addNewChat: () => addNewChatMutation.mutate(),
    addMessageToActiveChat: (message) => 
      addMessageMutation.mutate({ message, sessionId: store.activeSessionId }),
  };
};

export default useChatStore;