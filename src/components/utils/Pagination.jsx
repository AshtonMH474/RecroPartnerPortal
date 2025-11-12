function Pagination({ totalPages, currentPage, goToPage }) {
if(totalPages <= 1) return
  return (
    <div className="flex justify-center gap-2 mt-4 flex-wrap">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-4 py-2 rounded transition-all duration-200 ${
            currentPage === i
              ? "bg-primary text-white border border-white/15"
              : "cursor-pointer border border-white/15 bg-[#1A1A1E] text-white hover:opacity-80 transition-opacity duration-200"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

export default Pagination;