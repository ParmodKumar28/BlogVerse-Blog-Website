import { CATEGORIES } from "../../utils/blog.constants";

const CategoryTabs = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-6 pt-2 mt-10 overflow-x-auto border-b border-zinc-200 no-scrollbar">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelectCategory(cat)}
          className={`pb-3 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
            selectedCategory === cat
              ? "border-zinc-900 text-zinc-900"
              : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
