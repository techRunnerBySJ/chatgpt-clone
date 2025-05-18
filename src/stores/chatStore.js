import { create } from 'zustand';

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

export default useChatStore;