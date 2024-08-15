
/**
 * Types
 */

type KVType = {
  set: (key: string[], value: any, expireIn?: number) => Promise<void>;
  get: (key: string[]) => Promise<any>;
  delete: (key: string[]) => Promise<void>;
};

/**
 * Connect to KV storage
 */

const kv = await Deno.openKv(':memory:');

const KV: KVType = {
  set: async function (key: string[], value: any, expireIn?: number) {
    if (value !== null && value !== undefined) {
      if (expireIn === 0) {
        await kv.set(key, value);
      } else if (expireIn && expireIn > 0) {
        await kv.set(key, value, { expireIn });
      } else {
        await kv.set(key, value, { expireIn: 120000 }); // 2 minutes - Default expire time
      }
    }
  },
  get: async function (key: string[]) {
    const result = await kv.get(key);
    if (result.value !== null && result.value !== undefined) {
      return result.value;
    }
    return null;
  },
  delete: async function (key: string[]) {
    await kv.delete(key);
  },
};

export default KV;
