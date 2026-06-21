import { useState } from 'react';
import { getBadgeColor, getTextColor } from '../utils/colors';
import { TrashIcon } from 'lucide-react';

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
  const [editingData, setEditingData] = useState({
    name: '',
    mobile: '',
    upiId: '',
  });

  const startEditing = (idx, roommate) => {
    setEditingIndex(idx);
    setEditingData({ ...roommate });
  };

  const saveEdit = () => {
    if (editingIndex === null || !editingData.name.trim()) {
      setEditingIndex(null);
      return;
    }

    updateRoommate(editingIndex, {
      ...editingData,
      name: editingData.name.trim(),
    });

    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Add Roommate Section */}
      <section className="premium-card p-8">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Add roommate
          </h2>
          <p className="text-sm text-slate-500">
            Add a new member to your expense group
          </p>
        </div>

        <div className="space-y-3">
          <input
            value={roommateInput.name}
            onChange={(e) =>
              setRoommateInput((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            onKeyDown={(e) => e.key === 'Enter' && addRoommate()}
            className="input-premium w-full"
            placeholder="Name*"
          />

          <input
            value={roommateInput.mobile}
            onChange={(e) =>
              setRoommateInput((prev) => ({
                ...prev,
                mobile: e.target.value,
              }))
            }
            onKeyDown={(e) => e.key === 'Enter' && addRoommate()}
            className="input-premium w-full"
            placeholder="Mobile Number (Optional)"
          />

          <input
            value={roommateInput.upiId}
            onChange={(e) =>
              setRoommateInput((prev) => ({
                ...prev,
                upiId: e.target.value,
              }))
            }
            onKeyDown={(e) => e.key === 'Enter' && addRoommate()}
            className="input-premium w-full"
            placeholder="UPI ID (Optional)"
          />

          <button
            onClick={addRoommate}
            className="btn-premium w-full"
          >
            Add
          </button>
        </div>
      </section>

      {/* Members List */}
      <aside className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              Members
            </h2>

            <button
              onClick={clearAllNames}
              title="Delete all members"
            >
              <TrashIcon className="h-5 w-5 text-red-600" />
            </button>
          </div>

          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
            {roommates.length}
          </span>
        </div>

        <div className="mb-6 text-sm text-slate-500">
          Tap on a member card to edit
        </div>

        <div className="space-y-3">
          {roommates.length ? (
            roommates.map((roommate, idx) => {
              const bg = getBadgeColor(idx, roommate.name);
              const textColor = getTextColor(bg);

              return (
                <div
                  key={`${roommate.name}-${idx}`}
                  className="rounded-xl pl-4 py-3 shadow-soft-xs ring-1 ring-slate-100"
                  style={{ background: bg }}
                >
                  {editingIndex === idx ? (
                    <div
                      tabIndex={-1}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          cancelEdit();
                        }
                      }} className="space-y-2 pr-4">
                      <input
                        autoFocus
                        value={editingData.name}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Name"
                        className="w-full bg-slate-200 rounded px-2 py-1 text-sm outline-none"
                      />

                      <input
                        value={editingData.mobile}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            mobile: e.target.value,
                          }))
                        }
                        placeholder="Mobile Number (Optional)"
                        className="w-full bg-slate-200 placeholder:text-slate-500 rounded px-2 py-1 text-sm outline-none"
                      />

                      <input
                        value={editingData.upiId}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            upiId: e.target.value,
                          }))
                        }
                        placeholder="UPI Id (Optional)"
                        className="w-full bg-slate-200 placeholder:text-slate-500 rounded px-2 py-1 text-sm outline-none"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="text-md font-semibold"
                          style={{ color: textColor }}
                        >
                          Save
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="text-md"
                          style={{ color: textColor }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        startEditing(idx, roommate)
                      }
                      className="cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div
                          className="font-semibold text-sm"
                          style={{ color: textColor }}
                        >
                          {roommate.name}
                        </div>
                        <span style={{ color: textColor }} onClick={(e) => {
                          e.stopPropagation();
                          removeRoommate(idx);
                        }} className="px-4">
                          <TrashIcon className="h-5 w-5" />
                        </span>
                      </div>

                      {roommate.mobile && (
                        <div
                          className="text-xs mt-1"
                          style={{ color: textColor }}
                        >
                          Mobile: {roommate.mobile}
                        </div>
                      )}

                      {roommate.upiId && (
                        <div
                          className="text-xs"
                          style={{ color: textColor }}
                        >
                          UPI Id: {roommate.upiId}
                        </div>
                      )}
                    </div>
                  )}

                  {/* <div className="flex justify-end mt-2">
                    <button
                      onClick={() => removeRoommate(idx)}
                      className="rounded-lg p-1.5 transition-all"
                      style={{ background: textColor + '20' }}
                    >
                      <span style={{ color: textColor }}>
                        <TrashIcon className="h-5 w-5" />
                      </span>
                    </button>
                  </div> */}
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