import React, { useState, useEffect, useCallback } from 'react';
import { Note, AppState } from './types';
import { generateId, saveNotesToStorage, loadNotesFromStorage } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { NoteEditor } from './components/NoteEditor';

function App() {
  const [state, setState] = useState<AppState>({
    notes: [],
    selectedNoteId: null,
    searchQuery: '',
    isCreating: false
  });

  // Load notes from localStorage on app start
  useEffect(() => {
    const savedNotes = loadNotesFromStorage();
    setState(prev => ({ ...prev, notes: savedNotes }));
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (state.notes.length > 0) {
      saveNotesToStorage(state.notes);
    }
  }, [state.notes]);

  const handleNoteCreate = useCallback(() => {
    const newNote: Note = {
      id: generateId(),
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setState(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes],
      selectedNoteId: newNote.id,
      isCreating: true
    }));
  }, []);

  const handleNoteSelect = useCallback((noteId: string) => {
    setState(prev => ({
      ...prev,
      selectedNoteId: noteId,
      isCreating: false
    }));
  }, []);

  const handleNoteDelete = useCallback((noteId: string) => {
    setState(prev => {
      const newNotes = prev.notes.filter(note => note.id !== noteId);
      const newSelectedId = prev.selectedNoteId === noteId 
        ? (newNotes.length > 0 ? newNotes[0].id : null)
        : prev.selectedNoteId;
      
      return {
        ...prev,
        notes: newNotes,
        selectedNoteId: newSelectedId
      };
    });
  }, []);

  const handleNoteSave = useCallback((updates: Partial<Note>) => {
    setState(prev => {
      const noteIndex = prev.notes.findIndex(note => note.id === prev.selectedNoteId);
      if (noteIndex === -1) return prev;

      const updatedNotes = [...prev.notes];
      updatedNotes[noteIndex] = {
        ...updatedNotes[noteIndex],
        ...updates,
        updatedAt: new Date()
      };

      return {
        ...prev,
        notes: updatedNotes,
        isCreating: false
      };
    });
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const selectedNote = state.notes.find(note => note.id === state.selectedNoteId) || null;

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar
        notes={state.notes}
        selectedNoteId={state.selectedNoteId}
        searchQuery={state.searchQuery}
        onSearchChange={handleSearchChange}
        onNoteSelect={handleNoteSelect}
        onNoteCreate={handleNoteCreate}
        onNoteDelete={handleNoteDelete}
      />
      
      <div className="flex-1 bg-white">
        <NoteEditor
          note={selectedNote}
          onSave={handleNoteSave}
        />
      </div>
    </div>
  );
}

export default App;