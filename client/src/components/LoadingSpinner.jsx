const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
