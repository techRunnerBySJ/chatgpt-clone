import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const useChatStore = create((set, get) => ({
  chatSessions: JSON.parse(localStorage.getItem('chatSessions')) || [
    { id: 1, name: 'Chat 1', messages: [] },
  ],
  activeSessionId: JSON.parse(localStorage.getItem('activeSessionId')) || 1,

  setActiveSessionId: (id) => {
    localStorage.setItem('activeSessionId', JSON.stringify(id));
    set({ activeSessionId: id });
  },

  addNewChat: () => {
    const { chatSessions } = get();
    const newChatId = chatSessions.length + 1;
    const newChat = { id: newChatId, name: `Chat ${newChatId}`, messages: [] };
    const updatedSessions = [...chatSessions, newChat];
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    localStorage.setItem('activeSessionId', JSON.stringify(newChatId));
    set({ chatSessions: updatedSessions, activeSessionId: newChatId });
  },

  addMessageToActiveChat: (message) => {
    const { chatSessions, activeSessionId } = get();
    const updatedSessions = chatSessions.map((session) =>
      session.id === activeSessionId
        ? { ...session, messages: [...session.messages, message] }
        : session
    );
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    set({ chatSessions: updatedSessions });
  },

  syncWithLocalStorage: () => {
    const savedSessions = JSON.parse(localStorage.getItem('chatSessions')) || [
      { id: 1, name: 'Chat 1', messages: [] },
    ];
    const savedActiveSessionId = JSON.parse(localStorage.getItem('activeSessionId')) || savedSessions[0]?.id || 1;
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
    queryKey: ['chatSessions'],
    queryFn: () => {
      const savedSessions = JSON.parse(localStorage.getItem('chatSessions')) || [
        { id: 1, name: 'Chat 1', messages: [] },
      ];
      return savedSessions;
    },
    initialData: store.chatSessions,
  });

  // Mutation for adding a new chat
  const addNewChatMutation = useMutation({
    mutationFn: () => {
      const newChatId = chatSessions.length + 1;
      const newChat = { id: newChatId, name: `Chat ${newChatId}`, messages: [] };
      const updatedSessions = [...chatSessions, newChat];
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      localStorage.setItem('activeSessionId', JSON.stringify(newChatId));
      return { newChat, updatedSessions };
    },
    onSuccess: ({ newChat, updatedSessions }) => {
      queryClient.setQueryData(['chatSessions'], updatedSessions);
      store.setActiveSessionId(newChat.id);
    },
  });

  // Mutation for adding a message
  const addMessageMutation = useMutation({
    mutationFn: ({ message, sessionId }) => {
      const updatedSessions = chatSessions.map((session) =>
        session.id === sessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      );
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      return updatedSessions;
    },
    onSuccess: (updatedSessions) => {
      queryClient.setQueryData(['chatSessions'], updatedSessions);
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