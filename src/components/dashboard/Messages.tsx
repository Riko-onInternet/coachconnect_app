import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getUserId } from "@/utils/auth";
import { API_BASE_URL } from "@/utils/config";
import { ChevronRight, ChevronLeft, MessageSquare, Check, CheckCheck } from "lucide-react";

interface Chat {
  id: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  hasMessages: boolean;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export default function Messages() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Funzione per gestire il ridimensionamento della finestra
  useEffect(() => {
    const handleResize = () => {
      // Su schermi più grandi, mostra sempre la lista delle chat
      if (window.innerWidth >= 992) {
        setShowChatList(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Imposta lo stato iniziale

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Funzione per scorrere automaticamente ai messaggi più recenti
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/messages/chats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        // Verifica se la risposta è JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("La risposta del server non è in formato JSON");
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Errore nel caricamento delle chat");
        }

        setChats(data);
      } catch (error) {
        console.error("Errore nel caricamento delle chat:", error);
        setChats([]); // Imposta un array vuoto in caso di errore
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `${API_BASE_URL}/api/messages/${activeChat}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Errore nel caricamento dei messaggi:", error);
        }
      };

      fetchMessages();
    }
  }, [activeChat]);

  // Inizializza il socket una volta sola
  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io(API_BASE_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket");
      newSocket.emit("join", getUserId());
    });

    newSocket.on("connect_error", (error: Error) => {
      console.error("Errore di connessione socket:", error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []); // Esegui solo all'mount

  // Gestione messaggi e aggiornamenti chat
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message: Message) => {
      const currentUserId = getUserId();
      
      // Se il messaggio appartiene alla chat attiva, aggiorna i messaggi
      if (
        (message.senderId === currentUserId && message.receiverId === activeChat) ||
        (message.receiverId === currentUserId && message.senderId === activeChat)
      ) {
        setMessages((prev) => [...prev, message]);
      }
      
      // Aggiorna SEMPRE la lista delle chat con l'ultimo messaggio
      setChats((prevChats) =>
        prevChats.map((chat) => {
          // Trova la chat corrispondente al messaggio (sia che sia attiva o no)
          if (
            (chat.userId === message.senderId && message.receiverId === currentUserId) ||
            (chat.userId === message.receiverId && message.senderId === currentUserId)
          ) {
            // Determina se il messaggio è stato inviato dall'utente corrente
            const isCurrentUser = message.senderId === currentUserId;
            const displayMessage = isCurrentUser ? `Tu: ${message.content}` : message.content;
            
            return {
              ...chat,
              lastMessage: displayMessage,
              lastMessageTime: message.timestamp,
              hasMessages: true,
              // Incrementa il conteggio dei non letti solo se non è la chat attiva e il messaggio è in arrivo
              unreadCount: 
                activeChat === chat.userId || isCurrentUser ? chat.unreadCount : chat.unreadCount + 1,
            };
          }
          return chat;
        })
      );
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, activeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !socket) return;

    const currentUserId = getUserId();
    const messageData: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId || "",
      receiverId: activeChat,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    socket.emit("message", messageData);

    setNewMessage("");

    // Aggiorna la chat con l'ultimo messaggio
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.userId === activeChat) {
          return {
            ...chat,
            lastMessage: `Tu: ${messageData.content}`,
            lastMessageTime: messageData.timestamp,
            hasMessages: true,
          };
        }
        return chat;
      })
    );
  };

  // Definizione della funzione handleChatClick
  const handleChatClick = (userId: string) => {
    setActiveChat(userId);
    // Su dispositivi mobili, nascondi la lista delle chat quando si seleziona una chat
    if (window.innerWidth < 992) {
      setShowChatList(false);
    }
  };

  // Definizione della funzione handleBackToList
  const handleBackToList = () => {
    setShowChatList(true);
  };

  useEffect(() => {
    if (activeChat) {
      const markMessagesAsRead = async () => {
        try {
          const token = localStorage.getItem("token");
          await fetch(`${API_BASE_URL}/api/messages/${activeChat}/read`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error(
            "Errore nella marcatura dei messaggi come letti:",
            error
          );
        }
      };

      markMessagesAsRead();
    }
  }, [activeChat]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      {/* Lista chat - visibile solo quando showChatList è true o su schermi md e superiori */}
      <div
        className={`${
          showChatList ? "block" : "hidden lg:block"
        } w-full lg:w-80 lg:min-w-[20rem] border-r border-gray-200 dark:border-gray-700 flex flex-col lg:max-h-full max-h-[60vh]`}
      >
        <div className="p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">
            Messaggi
          </h2>
          {activeChat && window.innerWidth < 768 && (
            <button
              onClick={() => setShowChatList(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
        <div className="overflow-y-auto flex-1">
          {chats.length > 0 ? (
            <div className="space-y-1 p-2">
              {chats.map((chat) => (
                <button
                  key={chat.userId}
                  onClick={() => handleChatClick(chat.userId)}
                  className={`w-full p-2 lg:p-3 flex items-center gap-2 lg:gap-3 rounded-lg transition-colors ${
                    activeChat === chat.userId
                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                    {chat.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm lg:text-base text-gray-900 dark:text-white truncate">
                        {chat.userName}
                      </p>
                      {chat.lastMessageTime && (
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(chat.lastMessageTime).toLocaleDateString(
                            [],
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate">
                        {chat.lastMessage || "Nessun messaggio"}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
              Nessuna chat disponibile
            </div>
          )}
        </div>
      </div>

      {/* Area messaggi - visibile solo quando showChatList è false su mobile o sempre su desktop */}
      <div
        className={`${
          !showChatList || window.innerWidth >= 768 ? "flex" : "hidden lg:flex"
        } flex-1 flex-col bg-gray-50 dark:bg-gray-900 h-dvh`}
      >
        {activeChat ? (
          <div className="flex flex-col h-full relative">
            {/* Header della chat con pulsante indietro e info utente */}
            <div className="fixed lg:static top-0 lg:top-0 left-0 lg:left-auto right-0 lg:right-auto mt-14 lg:mt-0 z-10 p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center bg-white dark:bg-gray-800">
              {!showChatList && window.innerWidth < 768 && (
                <button
                  onClick={handleBackToList}
                  className="mr-2 lg:hidden p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold mr-2 lg:mr-3">
                {chats
                  .find((chat) => chat.userId === activeChat)
                  ?.userName.charAt(0)
                  .toUpperCase()}
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-white">
                {chats.find((chat) => chat.userId === activeChat)?.userName}
              </h3>
            </div>

            {/* Contenitore messaggi - SCROLLABLE con padding per header e form */}
            <div className="flex-1 p-3 lg:p-4 overflow-y-auto pt-16 lg:pt-0 pb-16 lg:pb-0">
              {messages.length > 0 ? (
                <div className="space-y-3 lg:space-y-4">
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === getUserId();
                    const showDate =
                      index === 0 ||
                      new Date(message.timestamp).toDateString() !==
                        new Date(messages[index - 1].timestamp).toDateString();

                    return (
                      <div
                        key={
                          message.id ||
                          `${message.senderId}-${message.timestamp}`
                        }
                      >
                        {showDate && (
                          <div className="flex justify-center my-3 lg:my-4">
                            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          } mb-2`}
                        >
                          <div
                            className={`max-w-[85%] lg:max-w-[70%] rounded-lg p-2 lg:p-3 ${
                              isCurrentUser
                                ? "bg-blue-500 text-white rounded-tr-none"
                                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words text-sm lg:text-base">
                              {message.content}
                            </p>
                            <div className="flex items-center justify-end mt-1 space-x-1">
                              <p className="text-xs opacity-70">
                                {new Date(message.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                              {isCurrentUser && (
                                <span className="text-xs">
                                  {message.read ? (
                                    <CheckCheck size={14} />
                                  ) : (
                                    <Check size={14} />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <MessageSquare size={36} strokeWidth={1} />
                  <p className="mt-2 text-sm lg:text-base">
                    Nessun messaggio. Inizia la conversazione!
                  </p>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="fixed lg:sticky bottom-0 lg:bottom-0 left-0 lg:left-auto right-0 lg:right-auto z-10 bg-white dark:bg-gray-800">
              <form
                onSubmit={handleSendMessage}
                className="p-2 lg:p-3 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    className="p-1.5 lg:p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    title="Allega file"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Scrivi un messaggio..."
                    className="flex-1 px-3 py-1.5 lg:px-4 lg:py-2 text-sm lg:text-base rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-1.5 lg:p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newMessage.trim()}
                    title="Invia messaggio"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 className="mt-4 text-lg lg:text-xl font-medium text-gray-700 dark:text-gray-300">
              I tuoi messaggi
            </h3>
            <p className="mt-2 text-center max-w-md px-4 text-sm lg:text-base">
              Seleziona una chat dalla lista per visualizzare i messaggi e
              iniziare a conversare
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
