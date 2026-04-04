// src/components/collab/SharedNoteEditor.tsx
import React, { useEffect, useRef } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useCollabStore } from '../../store/collabStore';

export default function SharedNoteEditor({ userId }: { userId: string }) {
  const { activeNote, updateNoteContent } = useCollabStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!activeNote) return;
    const unsub = onSnapshot(doc(db, 'notes', activeNote.id), (snap) => {
      if (snap.exists()) {
        updateNoteContent(activeNote.id, snap.data().content);
      }
    });
    return () => unsub();
  }, [activeNote?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeNote) return;
    const content = e.target.value;
    updateNoteContent(activeNote.id, content);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await updateDoc(doc(db, 'notes', activeNote.id), {
        content,
        lastEditedBy: userId,
        updatedAt: Date.now(),
      });
    }, 500);
  };

  if (!activeNote) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-2">Select a note to start editing</p>
          <p className="text-gray-300 text-sm">Choose from your notebooks on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
        {/* Note Header */}
        <div className="border-b border-gray-100 px-6 py-4">
          <h1 className="font-serif text-2xl text-gray-800">{activeNote.title}</h1>
          <p className="text-xs text-gray-400 mt-1">{activeNote.subject}</p>
        </div>
        
        {/* Editor */}
        <textarea
          value={activeNote.content}
          onChange={handleChange}
          className="flex-1 w-full p-6 text-gray-700 text-base leading-relaxed resize-none focus:outline-none bg-transparent font-sans"
          placeholder="Start writing your thoughts..."
        />
        
        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
          <p className="text-xs text-gray-400">
            Last edited {new Date(activeNote.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}