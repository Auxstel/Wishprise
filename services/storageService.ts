import { SurpriseData } from '../types';
import { set, get } from 'idb-keyval';

const STORAGE_KEY_PREFIX = 'wishprise_';

export const saveSurprise = async (data: SurpriseData): Promise<void> => {
  try {
    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Sanitize data 
    const sanitizedData = JSON.parse(JSON.stringify(data));
    
    // Use IndexedDB via idb-keyval. 
    // This supports Blobs/Files and large strings much better than localStorage.
    await set(STORAGE_KEY_PREFIX + data.id, sanitizedData);
    
  } catch (e: any) {
    console.error("Error saving to local storage: ", e);
    throw new Error(e.message || "Failed to save surprise locally.");
  }
};

export const getSurprise = async (id: string): Promise<SurpriseData | null> => {
  try {
    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Try IndexedDB first
    const data = await get(STORAGE_KEY_PREFIX + id);
    if (data) {
      return data as SurpriseData;
    }
    
    // Fallback: Check old LocalStorage (migration path for previous saves)
    const lsData = localStorage.getItem(STORAGE_KEY_PREFIX + id);
    if (lsData) {
        return JSON.parse(lsData) as SurpriseData;
    }

    return null;
  } catch (e) {
    console.error("Error getting from local storage: ", e);
    return null;
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};