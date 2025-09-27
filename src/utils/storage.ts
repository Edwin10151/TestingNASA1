import { Note } from '../types';

const NOTES_KEY = 'notes-app-data';

export const saveNotesToStorage = (notes: Note[]): void => {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes to localStorage:', error);
  }
};

export const loadNotesFromStorage = (): Note[] => {
  try {
    const storedNotes = localStorage.getItem(NOTES_KEY);
    if (!storedNotes) return [];
    
    const notes = JSON.parse(storedNotes);
    return notes.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to load notes from localStorage:', error);
    return [];
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};