import type { APIUser } from '../typescript/serverTypes.ts';
import { saveCanvasSession } from '../libs/canvasLib.ts';

/**
 * Types
 */

type SaveCanvasArgs = {
  canvasData: string;
};

/**
 * POSt API
 * Save canvas for user
 */

export async function saveCanvas(args: SaveCanvasArgs, apiUser: APIUser): Promise<boolean> {

  const { canvasData } = args;
  if (canvasData) {
    await saveCanvasSession(apiUser.userId, canvasData);
  }

  return true;
}

// if (import.meta.main) {
//   console.log('Add 2 + 3 =', add(2, 3));
// }

// import { assertEquals } from '@std/assert';
// import { add } from './main.ts';

// Deno.test(function addTest() {
//   assertEquals(add(2, 3), 5);
// });
