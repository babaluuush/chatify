import "./Chat.css";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useAuth } from "../context/AuthProvider";
import { getMessages, createMessage, deleteMessage } from "../services/authService";

export default function Chat() {
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function load() {
    const data = await getMessages();
    setMessages(data);
  }

  useEffect(() => { load(); }, []);

  function isMine(msg) {
    const myId = auth?.user?.id;
    const myUser = auth?.user?.user;
    return (
      msg.userId === myId ||
      msg.authorId === myId ||
      msg.user === myUser ||
      msg.ownerId === myId
    );
  }

  async function onSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const clean = DOMPurify.sanitize(text, { ALLOWED_TAGS: ["b","i","em","strong","a","br"] });
    await createMessage({ text: clean }); // byt fält om API:t kräver
    setText("");
    await load();
  }

  async function onDelete(id) {
    await deleteMessage(id);
    await load();
  }

  return (
    <div className="chat">
      <form className="composer" onSubmit={onSend}>
        <input
          placeholder="Skriv ett meddelande..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button>Skicka</button>
      </form>

      <div className="messages">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            mine={isMine(m)}
            onDelete={isMine(m) ? () => onDelete(m.id) : undefined}
          >
            {m.text || m.message || m.content || String(m.body ?? "")}
          </MessageBubble>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ mine, children, onDelete }) {
  return (
    <div className={`bubble ${mine ? "mine" : "theirs"}`}>
      <div dangerouslySetInnerHTML={{ __html: children }} />
      {mine && <button className="del" onClick={onDelete}>🗑</button>}
    </div>
  );
}
