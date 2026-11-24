import { arrayUnion, doc, runTransaction } from "firebase/firestore";
import { db } from "@/firebase";

export interface Player {
  id: string;
  nombre: string;
  puntaje: number;
  estacionesCompletadas?: number[];
}

export async function completeStation(
  playerId: string,
  stationId: number,
  isCorrect: boolean,
): Promise<{ alreadyCompleted: boolean; points: number }> {
  return runTransaction(db, async (transaction) => {
    const playerRef = doc(db, "usuarios", playerId);
    const playerSnapshot = await transaction.get(playerRef);

    if (!playerSnapshot.exists()) {
      throw new Error("No encontramos a este participante. Vuelve a elegir tu nombre.");
    }

    const player = playerSnapshot.data();
    const completedStations = player.estacionesCompletadas;
    if (Array.isArray(completedStations) && completedStations.includes(stationId)) {
      return { alreadyCompleted: true, points: 0 };
    }

    const points = isCorrect ? 10 : 0;
    const currentScore = typeof player.puntaje === "number" ? player.puntaje : 0;

    transaction.update(playerRef, {
      puntaje: currentScore + points,
      estacionesCompletadas: arrayUnion(stationId),
    });

    return { alreadyCompleted: false, points };
  });
}
