import { useState, useEffect, useCallback, useRef, StrictMode } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Button,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  ConversationHeader,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import zoeIco from "../images/zoe.svg";
import NewConversationModal from "../components/NewConversationModal";

const API_URL = process.env.REACT_APP_API_URL;

const fake = false;

const Chat = ({ user }) => {
  console.log(user);
  const [bots, setBots] = useState([]);
  const [showNewConversationForm, setShowNewConversationForm] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [initialData, setInitialData] = useState({});
  const [needInitialData, setNeedInitialData] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hints, setHints] = useState([]);
  const isTypingRef = useRef(isTyping);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${API_URL}/conversations/${user.id}`);
        setConversations(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversations();
  }, [user.id]);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await axios.get(`${API_URL}/bots`);
        setBots(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBots();
  }, []);

  const handleNewConversation = async (selectedBot) => {
    try {
      const response = await axios.post(`${API_URL}/conversations`, {
        userId: user._id,
        botId: selectedBot,
      });
      setConversations([...conversations, response.data]);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const processMessage = useCallback(
    async (chatMessages) => {
      let typingTimer;
      const randomTypingEffect = () => {
        const minOffTime = isTypingRef.current ? 0 : 2000;
        const randomTimeout = Math.floor(Math.random() * 800) + minOffTime;
        setIsTyping((prevIsTyping) => !prevIsTyping);
        typingTimer = setTimeout(randomTypingEffect, randomTimeout);
      };

      typingTimer = setTimeout(randomTypingEffect, 500);
      let response;

      try {
        if (fake) {
          response = {
            data: { replyList: ["ooookkkaaaay", "go sox", "oh my", "whatevs"] },
          };
        } else {
          response = await axios.post(
            // "https://ineedahint-api.onrender.com/get-reply",
            `${API_URL}/get-reply`,
            chatMessages
          );
        }
      } catch (error) {
        response = { data: "error: no response received!" };
        console.error(error.message);
        const newMessage = {
          message: error.message,
          direction: "incoming",
          sentTime: "just now",
          sender: "Rainbow",
        };
        const newMessages = [...chatMessages, newMessage];
        setMessages(newMessages);
        setIsWaiting(false);
      } finally {
        console.log(response.data);
        const replies = response.data.replyList.map((reply, index) => ({
          id: index,
          text: reply,
        }));
        setHints(replies);
        console.log(response);
        const newMessage = {
          message: replies[0].text,
          direction: "incoming",
          sentTime: "just now",
          sender: "Rainbow",
        };
        const newMessages = [...chatMessages, newMessage];
        setMessages(newMessages);
        setIsWaiting(false);
        clearTimeout(typingTimer);
        setIsTyping(false);
        setShowButtons(true);
      }
    },
    [isTypingRef]
  );

  useEffect(() => {
    if (
      !needInitialData &&
      messages.length > 0 &&
      messages[messages.length - 1].message === "ok. lemme think a minute..."
    ) {
      setIsWaiting(true);
      processMessage(messages);
    }
  }, [messages, needInitialData, processMessage]);

  const handleSend = async (message) => {
    setIsWaiting(true);
    if (needInitialData) {
      await populateInitialData(message);
    } else {
      const newMessage = {
        message,
        direction: "outgoing",
        sender: "user",
      };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      await processMessage(newMessages);
    }
  };

  const populateInitialData = async (message) => {
    let reply;
    if (!initialData.problem) {
      const newInitialData = {
        problem: message,
      };
      setInitialData(newInitialData);
      reply = {
        message: "got it. what you have tried so far?",
        direction: "incoming",
        sentTime: "just now",
        sender: "Rainbow",
      };
    } else if (!initialData.tried) {
      const newInitialData = {
        problem: initialData.problem,
        tried: message,
      };
      setInitialData(newInitialData);
      reply = {
        message: "nice start. anything else I should know?",
        direction: "incoming",
        sentTime: "just now",
        sender: "Rainbow",
      };
    } else {
      setNeedInitialData(false);
      reply = {
        message: "ok. lemme think a minute...",
        direction: "incoming",
        sentTime: "just now",
        sender: "Rainbow",
      };
    }
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };
    const newMessages = [...messages, newMessage, reply];
    setMessages(newMessages);
    setIsWaiting(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Start New Conversation
      </Button>
      <NewConversationModal
        open={open}
        handleClose={handleClose}
        bots={bots}
        handleNewConversation={handleNewConversation}
      />
      <div style={{ height: "80vh", overflow: "auto" }}>
        <StrictMode>
          <MainContainer>
            <Sidebar position="left" scrollable={false}>
              <Search placeholder="Search..." />
              <ConversationList>
                {conversations.map((conversation) => (
                  <Conversation
                    key={conversation.id}
                    name={conversation.name}
                    lastSender={conversation.lastMessage.sender}
                    lastText={conversation.lastMessage.text}
                  >
                    <Avatar src={zoeIco} name={conversation.name} />
                  </Conversation>
                ))}
              </ConversationList>
            </Sidebar>
            <ChatContainer>
              <ConversationHeader>
                <Avatar src={zoeIco} name="Zoe" />
                <ConversationHeader.Content
                  userName="Zoe"
                  info="Active 10 mins ago"
                />
              </ConversationHeader>
              <MessageList
                scrollBehavior="smooth"
                style={{ flex: 1, overflowY: "auto" }}
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="ChatGPT is typing" />
                  ) : null
                }
              >
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />;
                })}
              </MessageList>
              <div as="MessageInput">
                {showButtons && (
                  <>
                    <Button
                      border
                      style={{ margin: "10px" }}
                      onClick={() => {
                        if (currentHintIndex < hints.length - 1) {
                          setCurrentHintIndex(currentHintIndex + 1);
                          const newMessage = {
                            message: hints[currentHintIndex + 1].text,
                            direction: "incoming",
                            sentTime: "just now",
                            sender: "Rainbow",
                          };
                          const newMessages = [...messages, newMessage];
                          setMessages(newMessages);
                        } else {
                          const newMessage = {
                            message:
                              "Ask me a question to guide my next set of hints for you.",
                            direction: "incoming",
                            sentTime: "just now",
                            sender: "Rainbow",
                          };
                          const newMessages = [...messages, newMessage];
                          setMessages(newMessages);
                          setShowButtons(false);
                        }
                      }}
                    >
                      Another Hint
                    </Button>

                    <Button
                      border
                      style={{ margin: "10px" }}
                      onClick={() => {
                        setShowButtons(false);
                      }}
                    >
                      I want to ask a follow-up
                    </Button>
                  </>
                )}
                {!showButtons && (
                  <MessageInput
                    autoFocus
                    attachButton={false}
                    placeholder={isWaiting ? "" : "Type message here"}
                    onSend={handleSend}
                    disabled={isWaiting}
                    style={{ flexGrow: 1 }}
                  />
                )}
              </div>
            </ChatContainer>
          </MainContainer>
        </StrictMode>
        {showNewConversationForm ? (
          <div>
            <select
              value={selectedBot}
              onChange={(e) => setSelectedBot(e.target.value)}
            >
              {bots.map((bot) => (
                <option key={bot._id} value={bot._id}>
                  {bot.name}
                </option>
              ))}
            </select>
            <button onClick={handleNewConversation}>Start Conversation</button>
          </div>
        ) : (
          <button onClick={() => setShowNewConversationForm(true)}>
            Start New Conversation
          </button>
        )}
      </div>
    </div>
  );
};

export default Chat;
