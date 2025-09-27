import React, { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { Save, FileText } from 'lucide-react';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Partial<Note>) => void;
  onTitleChange?: (title: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onTitleChange
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = useCallback(async () => {
    if (!title.trim() && !content.trim()) return;
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate save delay
    
    onSave({
      title: title.trim() || 'Untitled Note',
      content: content.trim()
    });
    
    setIsSaving(false);
  }, [title, content, onSave]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onTitleChange?.(newTitle);
  };

  // Auto-save after 1 second of inactivity
  useEffect(() => {
    if (!note || (!title.trim() && !content.trim())) return;
    
    const timeoutId = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [title, content, note, handleSave]);

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No note selected</h3>
          <p>Create a new note or select an existing one to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Note title..."
          className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none flex-1 placeholder-gray-400"
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      <div className="flex-1 p-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="w-full h-full resize-none border-none outline-none text-gray-700 placeholder-gray-400 leading-relaxed"
          style={{ fontSize: '16px', lineHeight: '1.6' }}
        />
      </div>
    </div>
  );
};