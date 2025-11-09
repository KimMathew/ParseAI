import { supabase } from './supabaseClient'

// USER TABLE
export async function createUser({ id, name, email }: { id: string, name: string, email: string }) {
  return await supabase.from('users').insert([{ id, name, email }]);
}

export async function getUserById(id: string) {
  return await supabase.from('users').select('*').eq('id', id).single();
}

export async function getUserByEmail(email: string) {
  return await supabase.from('users').select('*').eq('email', email).single();
}

// DOCUMENT TABLE
export async function createDocument({ user_id, title, file_url, file_type, original_text }: { user_id: string, title: string, file_url: string, file_type: string, original_text?: string }) {
  return await supabase.from('documents').insert([{ user_id, title, file_url, file_type, original_text }]).select().single();;
}

export async function getDocumentsByUser(user_id: string) {
  return await supabase.from('documents').select('*').eq('user_id', user_id).order('created_at', { ascending: false });
}

export async function getDocumentById(id: string) {
  return await supabase.from('documents').select('*').eq('id', id).single();
}

// SUMMARIES TABLE
export async function createSummary({ document_id, abstract_summary, introduction_summary, methodology_summary, results_summary, conclusion_summary, keywords }: { document_id: string, abstract_summary: string, introduction_summary: string, methodology_summary: string, results_summary: string, conclusion_summary: string, keywords: string }) {
  return await supabase.from('summaries').insert([{ document_id, abstract_summary, introduction_summary, methodology_summary, results_summary, conclusion_summary, keywords }]);
}

export async function getSummaryByDocumentId(document_id: string) {
  return await supabase.from('summaries').select('*').eq('document_id', document_id).single();
}

// FILE UPLOAD TO SUPABASE STORAGE
export async function uploadFileToStorage(file: File, path: string) {
  const result = await supabase.storage.from('documents').upload(path, file);
  if (result.error) {
    // eslint-disable-next-line no-console
    console.error('Supabase upload error:', result.error, 'path:', path, 'file:', file);
  }
  return result;
}
