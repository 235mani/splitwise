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
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({
    name: '',
    mobile: '',
    upiId: '',
  });

  const startEditing = (idx, roommate) => {
    setEditingId(roommate.id);
    setEditingData({ ...roommate });
  };

  const saveEdit = () => {
    if (editingId === null) return;

    const name = editingData.name.trim();

    if (!name) {
      return;
    }

    const duplicate = roommates.some(
      (roommate, idx) =>
        roommate.id !== editingId &&
        roommate.name.toLowerCase() ===
        name.toLowerCase()
    );

    if (duplicate) {
      return;
    }

    updateRoommate(editingId, {
      ...editingData,
      name,
    });

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleAddOnEnter = (e) => {
    if (e.key === 'Enter') {
      addRoommate();
    }
  };

  const handleSaveOnEnter = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Add Roommate Section */}
      <section className="premium-card p-6">
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
            onKeyDown={handleAddOnEnter}
            className="input-premium"
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
            onKeyDown={handleAddOnEnter}
            className="input-premium"
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
            onKeyDown={handleAddOnEnter}
            className="input-premium"
            placeholder="UPI ID (Optional)"
          />

          <button
            onClick={addRoommate}
            className="btn-premium"
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
                  key={roommate.id}
                  className="premium-card p-4"
                  tabIndex={-1}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      cancelEdit();
                    }
                  }}
                >
                  {editingId === roommate.id ? (
                    <div className="space-y-2">
                      <input
                        value={editingData.name}
                        onKeyDown={handleSaveOnEnter}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="input-premium"
                        placeholder="Name*"
                      />

                      <input
                        value={editingData.mobile}
                        onKeyDown={handleSaveOnEnter}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            mobile: e.target.value,
                          }))
                        }
                        className="input-premium"
                        placeholder="Mobile Number (Optional)"
                      />

                      <input
                        value={editingData.upiId}
                        onKeyDown={handleSaveOnEnter}
                        onChange={(e) =>
                          setEditingData((prev) => ({
                            ...prev,
                            upiId: e.target.value,
                          }))
                        }
                        className="input-premium"
                        placeholder="UPI ID (Optional)"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={saveEdit}
                          className="btn-secondary"
                        >
                          Save
                        </button>

                        <button
                          onClick={cancelEdit}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => startEditing(idx, roommate)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-full flex items-center justify-center font-semibold"
                            style={{
                              background: bg,
                              color: textColor,
                            }}
                          >
                            {roommate.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <div className="font-semibold text-slate-800">
                              {roommate.name}
                            </div>

                            {roommate.mobile && (
                              <div className="text-xs text-slate-500">
                                {roommate.mobile}
                              </div>
                            )}

                            {roommate.upiId && (
                              <div className="text-xs text-slate-500">
                                {roommate.upiId}
                              </div>
                            )}
                          </div>
                        </div>

                        <button onClick={(e) => {
                          e.stopPropagation();
                          removeRoommate(idx);
                        }} className="px-4">
                          <TrashIcon
                            className="h-5 w-5 text-red-600"
                          />
                        </button>
                      </div>
                    </div>
                  )}
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