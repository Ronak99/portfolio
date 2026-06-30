export type BestMove = {
  from: string;
  to: string;
  promotion?: string;
  uci: string;
};

export type DifficultyConfig = {
  skillLevel: 0 | 10 | 20;
  depth: number;
};

export const DIFFICULTY_CONFIG: Record<1 | 2 | 3, DifficultyConfig> = {
  1: { skillLevel: 0, depth: 5 },
  2: { skillLevel: 10, depth: 8 },
  3: { skillLevel: 20, depth: 12 },
};

const ENGINE_PATH = "/stockfish/stockfish-18-lite-single.js";

function parseBestMove(line: string): BestMove | null {
  if (!line.startsWith("bestmove ")) return null;

  const uci = line.slice("bestmove ".length).trim().split(/\s+/)[0];
  if (!uci || uci === "(none)") return null;

  return {
    uci,
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci[4] || undefined,
  };
}

export class StockfishClient {
  private worker: Worker | null = null;
  private ready = false;
  private initPromise: Promise<void> | null = null;
  private initResolve: (() => void) | null = null;
  private initReject: ((error: Error) => void) | null = null;
  private pendingGo: {
    resolve: (move: BestMove) => void;
    reject: (error: Error) => void;
  } | null = null;
  private skillLevel: 0 | 10 | 20 = 10;

  private handleMessage = (event: MessageEvent<string>) => {
    const line = String(event.data);

    if (line === "uciok") {
      this.ready = true;
      this.initResolve?.();
      this.initResolve = null;
      this.initReject = null;
      return;
    }

    if (line.startsWith("bestmove ")) {
      const move = parseBestMove(line);
      if (!move) {
        this.pendingGo?.reject(new Error("Engine returned no legal move"));
      } else {
        this.pendingGo?.resolve(move);
      }
      this.pendingGo = null;
    }
  };

  private handleError = (event: ErrorEvent) => {
    const error = new Error(event.message || "Stockfish worker error");
    this.pendingGo?.reject(error);
    this.pendingGo = null;
    this.initReject?.(error);
    this.initResolve = null;
    this.initReject = null;
  };

  init(): Promise<void> {
    if (this.ready) return Promise.resolve();
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      try {
        this.worker = new Worker(ENGINE_PATH);
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error("Failed to start Stockfish worker"),
        );
        return;
      }

      this.initResolve = resolve;
      this.initReject = reject;
      this.worker.addEventListener("message", this.handleMessage);
      this.worker.addEventListener("error", this.handleError);
      this.worker.postMessage("uci");
    });

    return this.initPromise;
  }

  private send(command: string) {
    if (!this.worker) {
      throw new Error("Stockfish worker is not initialized");
    }
    this.worker.postMessage(command);
  }

  async ensureReady(): Promise<void> {
    await this.init();
    if (!this.ready) {
      throw new Error("Stockfish failed to initialize");
    }
  }

  newGame(): void {
    this.send("ucinewgame");
  }

  setSkillLevel(level: 0 | 10 | 20): void {
    this.skillLevel = level;
    this.send(`setoption name Skill Level value ${level}`);
  }

  setPosition(fen: string, moves: string[] = []): void {
    const moveSuffix = moves.length ? ` moves ${moves.join(" ")}` : "";
    this.send(`position fen ${fen}${moveSuffix}`);
  }

  async go(depth: number): Promise<BestMove> {
    await this.ensureReady();
    this.setSkillLevel(this.skillLevel);

    return new Promise((resolve, reject) => {
      this.pendingGo = { resolve, reject };
      this.send(`go depth ${depth}`);
    });
  }

  async requestMove(
    fen: string,
    difficulty: 1 | 2 | 3,
  ): Promise<BestMove> {
    const config = DIFFICULTY_CONFIG[difficulty];
    this.setSkillLevel(config.skillLevel);
    this.setPosition(fen);
    return this.go(config.depth);
  }

  quit(): void {
    if (!this.worker) return;

    this.worker.removeEventListener("message", this.handleMessage);
    this.worker.removeEventListener("error", this.handleError);

    try {
      this.worker.postMessage("quit");
    } catch {
      // Worker may already be terminated.
    }

    this.worker.terminate();
    this.worker = null;
    this.ready = false;
    this.initPromise = null;
    this.initResolve = null;
    this.initReject = null;
    this.pendingGo = null;
  }
}
