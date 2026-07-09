import type { EngineStatus } from "@/lib/stockfish/enginePool";
import type { GameDefinition } from "./types";

/**
 * The games eligible for the shuffle pool right now. A game that needs the
 * Stockfish engine is only offered once the engine is fully ready, so the user
 * never lands on a chess board that is waiting on (or missing) the engine.
 */
export function getPlayableGames(
  games: GameDefinition[],
  engineStatus: EngineStatus,
): GameDefinition[] {
  return games.filter((game) => {
    if (game.status !== "playable") return false;
    if (game.engineRequirement === "stockfish" && engineStatus !== "ready") {
      return false;
    }
    return true;
  });
}
