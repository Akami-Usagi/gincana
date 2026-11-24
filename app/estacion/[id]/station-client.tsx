"use client";

import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { completeStation, type Player } from "@/lib/players";
import { questions } from "@/lib/questions";

interface StationClientProps {
  stationId: number;
}

export default function StationClient({ stationId }: StationClientProps) {
  const question = questions[stationId - 1];
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ points: number; alreadyCompleted: boolean } | null>(null);
  const [error, setError] = useState("");
  const selectedPlayer = players.find((player) => player.id === selectedPlayerId);
  const hasCompletedStation = selectedPlayer?.estacionesCompletadas?.includes(stationId) ?? false;

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

  function choosePlayer(playerId: string) {
    setSelectedPlayerId(playerId);
    setSelectedAnswer(null);
    setResult(null);
    setError("");
  }

  async function submitAnswer(answerIndex: number) {
    if (!selectedPlayer || !question || saving || result || hasCompletedStation) return;

    setSelectedAnswer(answerIndex);
    setSaving(true);
    setError("");

    try {
      setResult(
        await completeStation(
          selectedPlayer.id,
          stationId,
          answerIndex === question.correctIndex,
        ),
      );
    } catch (submissionError) {
      setError(
        `No se pudo guardar tu respuesta: ${submissionError instanceof Error ? submissionError.message : "Intenta de nuevo."}`,
      );
      setSelectedAnswer(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-shell station-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Gincana tecnológica, inicio">
          <span className="brand-mark" aria-hidden="true">G</span>
          <span>Gincana tecnológica</span>
        </Link>
        <span className="station-tag">Estación {String(stationId).padStart(2, "0")} / 10</span>
      </header>

      <section className="station-card panel">
        <span className="step-label">RETO DE LA ESTACIÓN {stationId}</span>
        <h1>{selectedPlayer ? `¡Tú puedes, ${selectedPlayer.nombre}!` : "¿Quién eres?"}</h1>

        {loading ? (
          <p className="muted">Cargando participantes...</p>
        ) : players.length === 0 ? (
          <div className="empty-state">
            <p>Todavía no hay participantes registrados.</p>
            <Link className="button button-primary inline-button" href="/">Registrarme</Link>
          </div>
        ) : !selectedPlayer ? (
          <>
            <p className="muted">Elige tu nombre para comenzar el reto.</p>
            <div className="player-picker">
              {players.map((player) => (
                <button
                  className="player-choice"
                  key={player.id}
                  type="button"
                  onClick={() => choosePlayer(player.id)}
                >
                  <span className="participant-avatar" aria-hidden="true">{player.nombre.charAt(0).toUpperCase()}</span>
                  <span>{player.nombre}</span>
                  <span className="choice-arrow" aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="muted">Elige la respuesta correcta. ¡Mucha suerte!</p>
            {result?.alreadyCompleted || (!result && hasCompletedStation) ? (
              <div className="result-box result-neutral" role="status">
                <strong>¡Ya completaste esta estación!</strong>
                <span>Tu puntaje actual es de {selectedPlayer.puntaje ?? 0} puntos.</span>
              </div>
            ) : result ? (
              <div className={`result-box ${result.points ? "result-success" : "result-neutral"}`} role="status">
                <strong>{result.points ? "¡Respuesta correcta! +10 puntos" : "¡Buen intento! En esta ocasión sumas 0 puntos."}</strong>
                {!result.points && <span>La respuesta correcta era: {question.answers[question.correctIndex]}.</span>}
                <span>Tu puntaje actual es de {selectedPlayer.puntaje ?? 0} puntos.</span>
              </div>
            ) : (
              <>
                <h2 className="question-text">{question.question}</h2>
                <div className="answer-list">
                  {question.answers.map((answer, index) => (
                    <button
                      className={`answer-button ${selectedAnswer === index ? "answer-selected" : ""}`}
                      key={answer}
                      type="button"
                      onClick={() => submitAnswer(index)}
                      disabled={saving}
                    >
                      <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                      <span>{answer}</span>
                    </button>
                  ))}
                </div>
                {saving && <p className="muted" role="status">Guardando tu respuesta...</p>}
              </>
            )}
            {error && <p className="notice notice-error" role="alert">{error}</p>}
            <button className="button button-secondary change-player" type="button" onClick={() => choosePlayer("")}>
              Elegir otro participante
            </button>
          </>
        )}

        {!selectedPlayer && error && <p className="notice notice-error" role="alert">{error}</p>}
      </section>
      <footer className="page-footer station-footer">
        <Link className="text-link" href="/">Volver al inicio</Link>
        <span>Una respuesta por estación</span>
      </footer>
    </main>
  );
}
