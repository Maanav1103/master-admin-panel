export const Loader = ({ loadingText }: { loadingText?: string }) => {
  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="h-64 flex flex-col items-center justify-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        {loadingText && <p>{loadingText}</p>}
      </div>
    </div>
  );
};
