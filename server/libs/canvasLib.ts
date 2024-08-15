import KV from '../data/kv.ts';
import { type CanvasSessionType } from '../typescript/apiResultTypes.ts';

const DEFAULT_CANVAS_VALUES = {
  selectedTool: 'PEN',
  history: [],
  chunksCount: 0,
};

/**
 * Fetch an existing canvas session
 */

export async function fetchCanvasSession(userId: string): Promise<CanvasSessionType> {
  const userCanvasState = await KV.get(['session', userId]);
  if (!userCanvasState) {
    return {
      selectedTool: DEFAULT_CANVAS_VALUES.selectedTool,
      history: DEFAULT_CANVAS_VALUES.history,
      canvasData: ''
    };
  }

  const chunksCount = userCanvasState.chunksCount || 0;
  const canvasChunks = await Promise.all([...Array(chunksCount)].map((_, i) =>
    KV.get(['canvas_data', userId, String(i)])
  ));

  let canvasData = '';
  if (canvasChunks.length === chunksCount) {
    // It's possible that one of the cache chunk is missing
    canvasData = canvasChunks.join('');
  }

  // console.log('FETCHED CHUNK DATA');
  // console.log('>>' + chunksCount);

  return {
    selectedTool: DEFAULT_CANVAS_VALUES.selectedTool,
    history: DEFAULT_CANVAS_VALUES.history,
    canvasData
  };
}

/**
 * Create a new session
 */

export async function createCanvasSession(userId: string): Promise<CanvasSessionType> {
  await KV.set(['session', userId], DEFAULT_CANVAS_VALUES);
  return {
    selectedTool: DEFAULT_CANVAS_VALUES.selectedTool,
    history: DEFAULT_CANVAS_VALUES.history,
    canvasData: ''
  };
}

/**
 * Save session to userId
 */

export async function saveCanvasSession(userId: string, base64Data: string) {
  const currentSession = KV.get(['session', userId]) || DEFAULT_CANVAS_VALUES;

  // Split the base64 data into chunks of 500
  const chunkSize = 2500;
  const chunksCount = Math.ceil(base64Data.length / chunkSize);
  const chunks = [...Array(chunksCount)].map((_, i) =>
    base64Data.slice(i * chunkSize, (i + 1) * chunkSize)
  );

  const nextSession = {
    ...currentSession,
    chunksCount
  };

  await KV.set(['session', userId], nextSession);
  await Promise.all(chunks.map((chunk, i) =>
    KV.set(['canvas_data', userId, String(i)], chunk)
  ));

  // console.log('SAVED CHUNK DATA');
  // console.log(chunksCount);

  return true;
}

