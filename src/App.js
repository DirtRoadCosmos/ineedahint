import { useState, useEffect, useCallback, useRef, StrictMode } from "react";
// import Hint from "./Hint";
import "./index.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Button,
  // InputToolbox,
} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
const fake = false;

const App = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello! I give hints but not answers.",
      sentTime: "just now",
      sender: "Rainbow",
    },
    {
      message: "What are you trying to do?",
      sentTime: "just now",
      sender: "Rainbow",
    },
  ]);
  const [initialData, setInitialData] = useState({});
  const [needInitialData, setNeedInitialData] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hints, setHints] = useState([]);
  const isTypingRef = useRef(isTyping);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

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
            "https://ineedahint-api.onrender.com/get-reply",
            // "http://localhost:5000/get-reply",
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
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <StrictMode>
          <MainContainer>
            <ChatContainer style={{ display: "flex", flexDirection: "column" }}>
              <MessageList
                scrollBehavior="smooth"
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
              <div as="MessageInput" style={{ display: "flex", flexGrow: "1" }}>
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
      </div>
    </div>
  );
};

export default App;
