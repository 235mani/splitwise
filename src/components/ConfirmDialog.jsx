export default function ConfirmDialog({ confirm, onCancel, onConfirm, showOnlyOkay }) {
  if (!confirm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[26px] border border-white/70 bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-ink">{confirm.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{confirm.message}</p>
        <div className="mt-5 flex justify-end gap-3">
          {showOnlyOkay ? null : (
            <button onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
          <button onClick={onConfirm} className="inline-flex min-h-10 items-center justify-center rounded-xl bg-coral-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95">
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
