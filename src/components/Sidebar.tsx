import React, { useState } from 'react';
import { Note } from '../types';
import { SearchBar } from './SearchBar';
import { NoteItem } from './NoteItem';
import { Plus, FileText } from 'lucide-react';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNoteSelect: (noteId: string) => void;
  onNoteCreate: () => void;
  onNoteDelete: (noteId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  selectedNoteId,
  searchQuery,
  onSearchChange,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (noteId: string) => {
    if (deleteConfirm === noteId) {
      onNoteDelete(noteId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(noteId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Notes
          </h1>
          <button
            onClick={onNoteCreate}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            title="Create new note"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search notes..."
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            {searchQuery ? (
              <p>No notes found matching "{searchQuery}"</p>
            ) : (
              <p>No notes yet. Create your first note!</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotes.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                isSelected={note.id === selectedNoteId}
                onClick={() => onNoteSelect(note.id)}
                onDelete={() => handleDelete(note.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {deleteConfirm && (
        <div className="p-4 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-700 text-center">
            Click delete again to confirm
          </p>
        </div>
      )}
    </div>
  );
};