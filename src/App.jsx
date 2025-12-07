import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/admin/messages`);
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to load messages");
      }
      setMessages(data.messages);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE}/admin/messages/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete");
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selected && selected._id === id) setSelected(null);
    } catch (err) {
      alert(err.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "20px 20px 16px",
          boxShadow: "0 20px 45px rgba(15,23,42,0.12)",
          border: "1px solid #e5e7eb",
          minHeight: "85vh"
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#020617",
              }}
            >
              <img
                src={`${API_BASE}/static/vp-logo.png`}
                alt="VP"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Vansh Admin Dashboard
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Contact form messages viewer
              </div>
            </div>
          </div>
          <button
            onClick={fetchMessages}
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              border: "1px solid #2563eb",
              background: "#2563eb",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {error && (
          <div
            style={{
              marginBottom: "12px",
              padding: "8px 10px",
              borderRadius: "8px",
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1.1fr)",
            gap: "16px",
          }}
        >
          {/* LEFT: list */}
          <div
            style={{
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              padding: "8px",
              maxHeight: "480px",
              overflow: "auto",
            }}
          >
            {messages.length === 0 && !loading && (
              <div
                style={{
                  padding: "18px",
                  fontSize: "14px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                No messages yet.
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m._id}
                onClick={() => setSelected(m)}
                style={{
                  padding: "10px 10px",
                  borderRadius: "10px",
                  marginBottom: "6px",
                  background:
                    selected && selected._id === m._id
                      ? "#e0edff"
                      : "#ffffff",
                  border:
                    selected && selected._id === m._id
                      ? "1px solid #2563eb"
                      : "1px solid #e5e7eb",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#111827",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {m.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {m.email}
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: "11px" }}>
                  <div style={{ color: "#6b7280" }}>
                    {new Date(m.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(m._id);
                    }}
                    disabled={deletingId === m._id}
                    style={{
                      marginTop: "4px",
                      padding: "3px 9px",
                      borderRadius: "999px",
                      border: "1px solid #ef4444",
                      background: "#fef2f2",
                      color: "#b91c1c",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    {deletingId === m._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: details */}
          <div
            style={{
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              padding: "14px 14px 16px",
              minHeight: "200px",
            }}
          >
            {!selected ? (
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  textAlign: "center",
                  marginTop: "40px",
                }}
              >
                Select a message from the left to view details.
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {selected.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#2563eb" }}>
                      {selected.email}
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>
                    {new Date(selected.createdAt).toLocaleString()}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    padding: "12px 12px",
                    borderRadius: "10px",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    fontSize: "14px",
                    whiteSpace: "pre-wrap",
                    color: "#111827",
                  }}
                >
                  {selected.message}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;