import React, { useState } from "react";

export default function RecoveryNoteForm({ onSubmit, onCancel }) {
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(note);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700 mb-1">Note</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        className="w-full p-2 border border-slate-300 rounded-lg"
        placeholder="Write note"
        autoFocus
      />
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  );
}
