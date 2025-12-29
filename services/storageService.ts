import { SurpriseData } from '../types';
import { supabase } from '../lib/supabase';

export const uploadFile = async (file: Blob | File, path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('media')
    .upload(path, file);

  if (error) {
    console.error('Upload Error:', error);
    throw error;
  }

  // Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(path);

  return publicUrl;
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
      songUrl: data.song_url, // Now a remote URL
      voiceMessageUrl: data.voice_message_url, // Now a remote URL
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

export const deleteSurpriseAndFiles = async (id: string, songUrl?: string, voiceUrl?: string) => {
  console.log(`[Privacy] Deleting surprise ${id} and associated files...`);

  // 1. Delete media files FIRST (while we still have the URLs)
  await deleteMedia(songUrl);
  await deleteMedia(voiceUrl);

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

const deleteMedia = async (url?: string) => {
  if (!url) return;
  try {
    // Extract filename from URL (e.g., .../media/songs/uuid-song.mp3 -> songs/uuid-song.mp3)
    const path = url.split('/media/')[1];
    if (!path) return;

    const { error } = await supabase.storage
      .from('media')
      .remove([path]);

    if (error) console.error("Error deleting file:", path, error);
  } catch (e) {
    console.error("Error in deleteMedia:", e);
  }
};
