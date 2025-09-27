import React from 'react';
import { Note } from '../types';
import { Trash2, Clock } from 'lucide-react';

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  isSelected,
  onClick,
  onDelete
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPreview = (content: string) => {
    return content.slice(0, 100) + (content.length > 100 ? '...' : '');
  };

  return (
    <div
      onClick={onClick}
      className={`group p-4 border-l-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
        isSelected
          ? 'border-l-blue-500 bg-blue-50 shadow-sm'
          : 'border-l-transparent hover:border-l-gray-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {note.title || 'Untitled Note'}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {getPreview(note.content)}
          </p>
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(note.updatedAt)}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200 ml-2"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};