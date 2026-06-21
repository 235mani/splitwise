export default function ConfirmDialog({ confirm, onCancel, onConfirm, showOnlyOkay }) {
  if (!confirm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-slate-800">{confirm.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{confirm.message}</p>
        <div className="mt-5 flex justify-end gap-3">
          {showOnlyOkay ? null : (
            <button onClick={onCancel} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          )}
          <button onClick={onConfirm} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}