import type { APIUser } from '../typescript/serverTypes.ts';
import { storeToDisk } from '../libs/fileLib.ts';

/**
 * Types
 */

/**
 * Upload file
 */

export async function uploadFile(multipartData: any, apiUser: APIUser): Promise<boolean> {

  console.log('Upload file');

  const result = await storeToDisk(multipartData);

  console.log(result);


  return true;
}
