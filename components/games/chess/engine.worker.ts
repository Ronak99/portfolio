import { chooseMove, type Difficulty } from "./ai";

type Request = { id: number; fen: string; difficulty: Difficulty };

// The worker `self` isn't typed without the "webworker" lib, so narrow it to
// just the bits we use to keep this file type-safe under the dom lib.
const ctx = self as unknown as {
  onmessage: ((event: MessageEvent<Request>) => void) | null;
  postMessage: (message: unknown) => void;
};

ctx.onmessage = (event) => {
  const { id, fen, difficulty } = event.data;
  const move = chooseMove(fen, difficulty);
  ctx.postMessage({ id, move });
};
