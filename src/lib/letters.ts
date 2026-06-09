import { db } from './firebase';
import { doc, runTransaction, getDoc } from 'firebase/firestore';

export interface Letter {
  username: string;
  message: string;
  color: string;
  date: string;
}

// 1000 entries is a safe ceiling to stay well under the 1MB Firestore document limit
const MAX_ENTRIES_PER_SHARD = 1000; 

/**
 * Submits a letter using a transaction to avoid race conditions.
 * Automatically provisions a new shard document when the threshold is hit.
 */
export async function submitLetter(username: string, message: string, color: string) {
  const metaRef = doc(db, 'letters', '_metadata');
  const timestamp = new Date().toISOString();
  const jsonStringEntry = JSON.stringify({ username, message, color, date: timestamp });

  await runTransaction(db, async (transaction) => {
    const metaSnap = await transaction.get(metaRef);
    let highestShard = 1;
    let currentCount = 0;

    if (metaSnap.exists()) {
      highestShard = metaSnap.data().highestShard || 1;
      currentCount = metaSnap.data().currentCount || 0;
    }

    // Roll over to a new shard if current one is full
    if (currentCount >= MAX_ENTRIES_PER_SHARD) {
      highestShard += 1;
      currentCount = 0;
    }

    const shardRef = doc(db, 'letters', highestShard.toString());
    const shardSnap = await transaction.get(shardRef);
    
    let currentBatch: string[] = [];
    if (shardSnap.exists()) {
      currentBatch = shardSnap.data().batch || [];
    }

    currentBatch.push(jsonStringEntry);

    // Write metadata updates and shard array updates atomically
    transaction.set(metaRef, { highestShard, currentCount: currentCount + 1 }, { merge: true });
    transaction.set(shardRef, { batch: currentBatch }, { merge: true });
  });
}

/**
 * Fetches the metadata to find out what the highest active shard is.
 */
export async function getHighestShardId(): Promise<number> {
  const metaRef = doc(db, 'letters', '_metadata');
  const metaSnap = await getDoc(metaRef);
  if (metaSnap.exists()) {
    return metaSnap.data().highestShard || 1;
  }
  return 1;
}

/**
 * Fetches and parses a single shard's array.
 */
export async function fetchShardLetters(shardId: number): Promise<Letter[]> {
  const shardRef = doc(db, 'letters', shardId.toString());
  const shardSnap = await getDoc(shardRef);
  
  if (!shardSnap.exists()) return [];
  
  const batch: string[] = shardSnap.data().batch || [];
  return batch.map((str) => JSON.parse(str));
}