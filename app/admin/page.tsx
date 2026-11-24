"use client";

import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { db } from "@/firebase";
import type { Player } from "@/lib/players";

const ADMIN_PASSWORD = "admin";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!authenticated) return;

    return onSnapshot(
      collection(db, "usuarios"),
      (snapshot) => {
        setPlayers(
          snapshot.docs
            .map((playerDoc) => ({
              id: playerDoc.id,
              ...(playerDoc.data() as Omit<Player, "id">),
            }))
            .sort(
              (a, b) =>
                (b.puntaje ?? 0) - (a.puntaje ?? 0) ||
                a.nombre.localeCompare(b.nombre, "es"),
            ),
        );
        setLoading(false);
        setError("");
      },
      (snapshotError) => {
        setError(`No se pudo cargar el marcador: ${snapshotError.message}`);
        setLoading(false);
      },
    );
  }, [authenticated]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setPasswordError("La contraseña no es correcta. Intenta de nuevo.");
      return;
    }

    setPasswordError("");
    setAuthenticated(true);
  }

  return (
    <main className="page-shell admin-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Gincana tecnológica, inicio">
          <span className="brand-mark" aria-hidden="true">G</span>
          <span>Gincana tecnológica</span>
        </Link>
        <Link className="text-link" href="/">Volver al inicio</Link>
      </header>

      {!authenticated ? (
        <section className="panel admin-login">
          <span className="step-label">SOLO ORGANIZADORES</span>
          <h1>Panel de resultados</h1>
          <p className="muted">Ingresa la contraseña para ver el marcador de la gincana.</p>
          <form className="registration-form" onSubmit={handleSubmit}>
            <label htmlFor="admin-password">Contraseña</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
              }}
              required
            />
            <button className="button button-primary" type="submit">Ver resultados</button>
          </form>
          {passwordError && <p className="notice notice-error" role="alert">{passwordError}</p>}
        </section>
      ) : (
        <section className="panel scoreboard-panel">
          <div className="section-heading">
            <div>
              <span className="step-label">MARCADOR EN VIVO</span>
              <h1>¡Así va la aventura!</h1>
              <p className="muted">Participantes ordenados por puntaje.</p>
            </div>
            <span className="count-badge">{players.length}</span>
          </div>

          {loading ? (
            <p className="muted">Cargando resultados...</p>
          ) : players.length === 0 ? (
            <p className="empty-state">Todavía no hay participantes registrados.</p>
          ) : (
            <ol className="score-list">
              {players.map((player, index) => (
                <li className={`score-row ${index === 0 ? "score-winner" : ""}`} key={player.id}>
                  <span className="score-rank">{index + 1}</span>
                  <span className="participant-avatar" aria-hidden="true">{player.nombre.charAt(0).toUpperCase()}</span>
                  <span className="score-name">{player.nombre}</span>
                  <span className="score-points">{player.puntaje ?? 0} <small>pts</small></span>
                </li>
              ))}
            </ol>
          )}
          {error && <p className="notice notice-error" role="alert">{error}</p>}
          <button
            className="button button-secondary logout-button"
            type="button"
            onClick={() => {
              setAuthenticated(false);
              setPassword("");
              setLoading(true);
            }}
          >
            Cerrar panel
          </button>
        </section>
      )}
      <footer className="page-footer"><span>Gincana tecnológica</span><span>¡Gracias por organizar!</span></footer>
    </main>
  );
}
