import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function App() {
  const [data, setData] = useState([]);
  const [poem, setPoem] = useState("");
  const [newEntry, setNewEntry] = useState("");
  const [loadingPoem, setLoadingPoem] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch(`${API_URL}/data`);
    const json = await res.json();
    setData(json.entries || []);
  };

  const handleAddEntry = async () => {
    if (!newEntry.trim()) return;
    await fetch(`${API_URL}/data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newEntry, date: new Date().toISOString() }),
    });
    setMessage("Entrée ajoutée");
    setNewEntry("");
    fetchData();
  };

  const handlePoem = async () => {
    setLoadingPoem(true);
    setPoem("");
    const res = await fetch(`${API_URL}/poem`);
    const json = await res.json();
    setPoem(json.poem);
    setLoadingPoem(false);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "80px auto", padding: "0 60px" }}>
      <p style={{ fontSize: "1.1rem", marginBottom: 8, fontStyle: "normal", textAlign: "center" }}>Mini Projet : Mélissa Treso, Jade Merle-Remond, Olivia Péret</p>
      <h1 style={{ fontSize: "3.6rem", marginBottom: 60 }}>Un souvenir, un poème.</h1>

      <div style={{ textAlign: "center" }}>
      <section style={{ marginBottom: 80 }}>
        <h2 style={{ fontSize: "2.4rem", marginBottom: 24 }}>Ce que vous avez laissé</h2>
        {data.length === 0 ? (
          <p style={{ marginBottom: 32 }}>Aucune entrée pour l'instant.</p>
        ) : (
          <ul style={{ lineHeight: 2, marginBottom: 32 }}>
            {data.map((entry, i) => (
              <li key={i}>{JSON.stringify(entry)}</li>
            ))}
          </ul>
        )}
        <h3 style={{ fontSize: "1.8rem", marginBottom: 16 }}>Écris ton propre poème.</h3>
        <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <input
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Votre texte..."
            style={{ padding: "10px 14px", width: "70%", fontSize: "1.3rem" }}
          />
          <button onClick={handleAddEntry} style={{ padding: "10px 24px", fontSize: "1.3rem" }}>
            Envoyer
          </button>
        </div>
        {message && <p style={{ color: "green", marginTop: 16 }}>{message}</p>}
      </section>

      <section>
        <h2 style={{ fontSize: "2.4rem", marginBottom: 24 }}>Pas d'inspi... génère ton propre poème.</h2>
        <button onClick={handlePoem} disabled={loadingPoem} style={{ padding: "12px 28px", fontSize: "1.3rem" }}>
          {loadingPoem ? "L'IA réfléchit..." : "Clique ici"}
        </button>
        {poem && (
          <pre style={{
            background: "#f5f5f5",
            padding: 32,
            marginTop: 32,
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
            fontSize: "1.4rem"
          }}>
            {poem}
          </pre>
        )}
      </section>
      </div>
    </div>
  );
}
