"use client";

import { addDoc, collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { db } from "@/firebase";
import type { Player } from "@/lib/players";

export default function Home() {
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return onSnapshot(
      collection(db, "usuarios"),
      (snapshot) => {
        setPlayers(
          snapshot.docs
            .map((playerDoc) => ({
              id: playerDoc.id,
              ...(playerDoc.data() as Omit<Player, "id">),
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
        );
        setLoading(false);
        setError("");
      },
      (snapshotError) => {
        setError(`No se pudieron cargar los participantes: ${snapshotError.message}`);
        setLoading(false);
      },
    );
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await addDoc(collection(db, "usuarios"), {
        nombre: trimmedName,
        puntaje: 0,
        estacionesCompletadas: [],
      });
      setName("");
      setSuccess(`¡Listo, ${trimmedName}! Ya puedes buscar los códigos QR.`);
    } catch (registrationError) {
      setError(
        `No se pudo guardar el registro: ${registrationError instanceof Error ? registrationError.message : "Intenta de nuevo."}`,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Gincana tecnológica, inicio">
          <span className="brand-mark" aria-hidden="true">G</span>
          <span>Gincana tecnológica</span>
        </Link>
        <Link className="text-link" href="/admin">Panel organizador</Link>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">¡Prepárate para jugar!</span>
          <h1>Explora, aprende<br />y suma puntos.</h1>
          <p>Regístrate con tu nombre y recorre las estaciones de la gincana. Cada reto es una nueva oportunidad para aprender.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="art-sun" />
          <span className="art-card art-card-one">101</span>
          <span className="art-card art-card-two">ABC</span>
          <span className="art-star">✦</span>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel registration-panel">
          <span className="step-label">PRIMER PASO</span>
          <h2>¿Cómo te llamas?</h2>
          <p className="muted">Escribe tu nombre para aparecer en la lista de participantes.</p>

          <form className="registration-form" onSubmit={handleSubmit}>
            <label htmlFor="player-name">Tu nombre</label>
            <input
              id="player-name"
              type="text"
              autoComplete="given-name"
              maxLength={40}
              placeholder="Por ejemplo, Valentina"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <button className="button button-primary" type="submit" disabled={saving || !name.trim()}>
              {saving ? "Guardando..." : "¡Quiero jugar!"}
            </button>
          </form>

          {success && <p className="notice notice-success" role="status">{success}</p>}
          {error && <p className="notice notice-error" role="alert">{error}</p>}
        </div>

        <div className="panel participants-panel">
          <div className="section-heading">
            <div>
              <span className="step-label">EQUIPO DE AVENTURA</span>
              <h2>Participantes</h2>
            </div>
            <span className="count-badge">{players.length}</span>
          </div>
          {loading ? (
            <p className="muted">Cargando participantes...</p>
          ) : players.length === 0 ? (
            <p className="empty-state">¡Sé el primero en registrarte!</p>
          ) : (
            <ul className="participant-list">
              {players.map((player, index) => (
                <li className="participant-row" key={player.id}>
                  <span className="participant-avatar" aria-hidden="true">{player.nombre.charAt(0).toUpperCase()}</span>
                  <span className="participant-name">{player.nombre}</span>
                  <span className="participant-number">#{index + 1}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <footer className="page-footer">
        <span>¡Diviértete aprendiendo!</span>
        <span>10 estaciones · 10 puntos por respuesta correcta</span>
      </footer>
    </main>
  );
}
