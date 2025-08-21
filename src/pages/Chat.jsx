import "./Chat.css";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useAuth } from "../context/AuthProvider";
import { getMessages, createMessage, deleteMessage } from "../services/authService";

export default function Chat() {
  const { auth } = useAuth();

  const [fakeChat] = useState([
    { text: "Tja tja, hur mår du?", avatar: "https://i.pravatar.cc/100?img=14", username: "Johnny" },
    { text: "Hallå!! Svara då!!", avatar: "https://i.pravatar.cc/100?img=14", username: "Johnny" },
    { text: "Sover du eller?! 😴", avatar: "https://i.pravatar.cc/100?img=14", username: "Johnny" },
  ]);

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
    await createMessage({ text: clean });
    setText("");
    await load();
  }

  async function onDelete(id) {
    await deleteMessage(id)
    await load();
  }

  return (
    <div className="chat">
      <form className="composer" onSubmit={onSend}>
        <input
          placeholder="Skriv ett meddelande…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button>Skicka</button>
      </form>

      <div className="messages">
        {fakeChat.map((m, i) => (
          <Bubble
            key={`fake-${i}`}
            mine={false}
            avatar={m.avatar}
            username={m.username}
            dangerouslyHtml={m.text}
          />
        ))}

        {messages.map((m) => (
          <Bubble
            key={m.id}
            mine={isMine(m)}
            onDelete={isMine(m) ? () => onDelete(m.id) : undefined}
            avatar={auth?.user?.avatar}
            username={auth?.user?.user}
            dangerouslyHtml={m.text || m.message || m.content || String(m.body ?? "")}
          />
        ))}
      </div>
    </div>
  );
}

function Bubble({ mine, avatar, username, dangerouslyHtml, onDelete }) {
  return (
    <div className={`bubble ${mine ? "mine" : "theirs"}`}>
      {!mine && avatar && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
          <img src={avatar} alt="" width="28" height="28" style={{ borderRadius: "50%" }} />
          <strong>{username}</strong>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: dangerouslyHtml }} />
      {mine && <button className="del" onClick={onDelete}>🗑</button>}
    </div>
  );
}
