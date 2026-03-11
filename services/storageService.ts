import { SurpriseData } from '../types';
import { supabase } from '../lib/supabase';

/**
 * Uploads a file to Supabase Storage and returns the RELATIVE PATH (not a public URL).
 * The path is stored in the DB; signed URLs are generated at read time for privacy.
 */
export const uploadFile = async (file: Blob | File, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('media')
    .upload(path, file);

  if (error) {
    console.error('Upload Error:', error);
    throw error;
  }

  // Return the relative path — signed URLs will be generated when fetching the surprise
  return path;
};

/**
 * Generates a signed URL for a private file. Returns empty string on failure.
 * @param path - relative path in the 'media' bucket (e.g., "songs/uuid-song.mp3")
 * @param expiresIn - seconds until the URL expires (default: 1 hour)
 */
/**
 * Checks if a value is an external URL (pasted link) vs a relative storage path.
 */
const isExternalUrl = (value: string): boolean => {
  return value.startsWith('http://') || value.startsWith('https://');
};

const getSignedUrl = async (path: string, expiresIn: number = 3600): Promise<string> => {
  // If it's an external URL (user pasted a link), return it as-is
  if (isExternalUrl(path)) return path;

  const { data, error } = await supabase.storage
    .from('media')
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error('Signed URL Error:', error);
    return '';
  }

  return data.signedUrl;
};

export const saveSurprise = async (data: SurpriseData): Promise<void> => {
  try {
    const { error } = await supabase
      .from('surprises')
      .insert([
        {
          id: data.id,
          sender_name: data.senderName,
          recipient_name: data.receiverName,
          intro_message: data.introMessage,
          personal_note: data.personalNote,
          final_message: data.finalMessage,
          cake_flavor: data.cakeFlavor,
          cake_style: data.cakeStyle,
          candle_count: data.candleCount,
          song_url: data.songUrl,
          voice_message_url: data.voiceMessageUrl,
          wheel_options: data.wheelOptions,
          created_at: new Date(data.createdAt).toISOString()
        }
      ]);

    if (error) throw error;

  } catch (e: any) {
    console.error("Error saving to Supabase: ", e);
    throw new Error(e.message || "Failed to save surprise.");
  }
};

export const getSurprise = async (id: string): Promise<SurpriseData | null> => {
  try {
    const { data, error } = await supabase
      .from('surprises')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    // Generate signed URLs for private media files (1 hour expiry)
    const songUrl = data.song_url
      ? await getSignedUrl(data.song_url)
      : undefined;

    const voiceMessageUrl = data.voice_message_url
      ? await getSignedUrl(data.voice_message_url)
      : undefined;

    // Map DB columns back to Frontend Types
    return {
      id: data.id,
      senderName: data.sender_name,
      receiverName: data.recipient_name,
      introMessage: data.intro_message,
      personalNote: data.personal_note,
      finalMessage: data.final_message,
      cakeFlavor: data.cake_flavor,
      cakeStyle: data.cake_style,
      candleCount: data.candle_count,
      songUrl,             // Now a temporary signed URL
      voiceMessageUrl,     // Now a temporary signed URL
      wheelOptions: data.wheel_options,
      createdAt: new Date(data.created_at).getTime()
    };
  } catch (e) {
    console.error("Error getting from Supabase: ", e);
    return null;
  }
};

export const generateId = (): string => {
  return crypto.randomUUID(); // Use standard UUIDs for DB compatibility
};

/**
 * Deletes surprise record and associated media files.
 * songPath/voicePath are now RELATIVE PATHS stored in DB (e.g., "songs/uuid-song.mp3")
 * not full URLs, so we need to fetch the raw paths from DB before deletion.
 */
export const deleteSurpriseAndFiles = async (id: string, songUrl?: string, voiceUrl?: string) => {
  console.log(`[Privacy] Deleting surprise ${id} and associated files...`);

  // First, fetch the raw paths from DB (the URLs passed in are signed URLs, not paths)
  const { data: record } = await supabase
    .from('surprises')
    .select('song_url, voice_message_url')
    .eq('id', id)
    .single();

  // 1. Delete media files using the stored relative paths (skip external URLs)
  if (record?.song_url && !isExternalUrl(record.song_url)) {
    await deleteMediaByPath(record.song_url);
  }
  if (record?.voice_message_url && !isExternalUrl(record.voice_message_url)) {
    await deleteMediaByPath(record.voice_message_url);
  }

  // 2. Delete the record from DB
  const { error } = await supabase
    .from('surprises')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting surprise record:", error);
  } else {
    console.log("Surprise record deleted successfully.");
  }
};

/**
 * Deletes a file from Supabase Storage using its relative path.
 */
const deleteMediaByPath = async (path: string) => {
  try {
    const { error } = await supabase.storage
      .from('media')
      .remove([path]);

    if (error) console.error("Error deleting file:", path, error);
    else console.log("Deleted file:", path);
  } catch (e) {
    console.error("Error in deleteMediaByPath:", e);
  }
};
