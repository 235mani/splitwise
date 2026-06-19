import { useState } from 'react';
import { getBadgeColor, getTextColor } from '../utils/colors';

export default function RoommatePanel({
  roommates,
  roommateInput,
  setRoommateInput,
  addRoommate,
  removeRoommate,
  clearAllNames,
  updateRoommate,
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');

  const startEditing = (idx, currentName) => {
    setEditingIndex(idx);
    setEditingName(currentName);
  };

  const saveEdit = () => {
    if (
      editingIndex === null ||
      !editingName.trim() ||
      editingName === roommates[editingIndex]
    ) {
      setEditingIndex(null);
      setEditingName('');
      return;
    }

    updateRoommate(editingIndex, editingName.trim());
    setEditingIndex(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingName('');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Add Roommate Section */}
      <section className="premium-card p-8">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Add roommate</h2>
          <p className="text-sm text-slate-500">
            Add a new member to your expense group
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
            <input
              value={roommateInput}
              onChange={(e) => setRoommateInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRoommate()}
              className="input-premium flex-1 sm:rounded-r-none"
              placeholder="Enter roommate name..."
            />
            <button
              onClick={addRoommate}
              className="btn-premium sm:rounded-l-none px-6"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={clearAllNames}
            className="rounded-full border border-red-200 bg-red-50/50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 hover:text-red-700"
          >
            Delete all members
          </button>
        </div>
      </section>

      {/* Roommates List */}
      <aside className="premium-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Members</h2>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
            {roommates.length}
          </span>
        </div>

        <div className="space-y-2">
          {roommates.length ? (
            roommates.map((name, idx) => {
              const bg = getBadgeColor(idx, name);
              const textColor = getTextColor(bg);

              return (
                <div
                  key={`${name}-${idx}`}
                  className="flex items-center justify-between rounded-xl px-4 py-3 shadow-soft-xs ring-1 ring-slate-100"
                  style={{ background: bg }}
                >
                  {editingIndex === idx ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="flex-1 bg-transparent outline-none font-semibold text-sm"
                      style={{ color: textColor }}
                    />
                  ) : (
                    <span
                      onClick={() => startEditing(idx, name)}
                      className="flex-1 font-semibold text-sm cursor-text"
                      style={{ color: textColor }}
                      title="Click to edit"
                    >
                      {name}
                    </span>
                  )}

                  <button
                    onClick={() => removeRoommate(idx)}
                    className="ml-3 rounded-lg p-1.5 transition-all"
                    style={{ background: textColor + '20' }}
                  >
                    <span style={{ color: textColor }}>✕</span>
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-slate-400 py-8 text-sm">
              No members yet. Add your first roommate!
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}