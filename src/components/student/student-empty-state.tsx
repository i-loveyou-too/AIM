export function StudentEmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <span className="text-4xl">📭</span>
      <p className="mt-3 text-sm text-muted">{message}</p>
    </div>
  );
}

export function StudentErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <span className="text-4xl">⚠️</span>
      <p className="mt-3 text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl border border-border px-4 py-2 text-sm font-medium text-text"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
