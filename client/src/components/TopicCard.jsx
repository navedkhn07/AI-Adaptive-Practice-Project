const TopicCard = ({ topic, onStart }) => {
  return (
    <button
      type="button"
      onClick={() => onStart(topic)}
      className="group relative h-full overflow-hidden rounded-2xl border border-cyan-100 bg-white/85 p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/70"
    >
      <div className="pointer-events-none absolute -right-12 -top-10 h-28 w-28 rounded-full bg-cyan-100/70 blur-2xl transition group-hover:bg-cyan-200/80" />
      <p className="mb-2 inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-700">
        Start Practice
      </p>
      <h3 className="relative text-lg font-bold text-slate-900 transition group-hover:text-cyan-700">{topic.name}</h3>
      <p className="relative mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{topic.description || "No description yet."}</p>
      <span className="relative mt-4 inline-flex text-sm font-semibold text-cyan-700 transition group-hover:translate-x-1">
        Open Topic -&gt;
      </span>
    </button>
  );
};

export default TopicCard;
