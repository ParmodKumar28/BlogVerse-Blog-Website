import { Link } from 'react-router-dom';
import {
  getBlogCoverImage,
  getAccurateReadTime,
  getFormattedCategory,
  getFormattedDate,
} from '../../utils/blogHelpers';
import { Clock, Trash2, ArrowRight, Edit3 } from 'lucide-react';

const UserStoryCard = ({ blog, index, onDeleteClick }) => {
  if (!blog) return null;

  const coverImg = getBlogCoverImage(blog, index);
  const readTime = getAccurateReadTime(blog);
  const formattedCat = getFormattedCategory(blog.category);
  const formattedDate = getFormattedDate(blog.createdAt);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs hover:border-zinc-300 transition flex flex-col sm:flex-row items-stretch">
      {/* Story Cover Thumbnail */}
      <div className="sm:w-48 aspect-[16/9] sm:aspect-auto overflow-hidden bg-zinc-100 flex-shrink-0 relative">
        <img
          src={coverImg}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className="tag-pill bg-white/90 backdrop-blur-xs text-[10px]">
            {formattedCat}
          </span>
        </div>
      </div>

      {/* Story Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-1">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" />
              {readTime}
            </span>
          </div>
          <h3 className="text-lg font-bold font-serif-editorial text-zinc-900 leading-snug hover:text-blue-600 transition">
            <Link to={`/posts/${blog._id}`}>{blog.title}</Link>
          </h3>
          {blog.subtitle && (
            <p className="text-xs text-zinc-500 font-serif-editorial italic mt-1 line-clamp-2">
              {blog.subtitle}
            </p>
          )}
        </div>

        {/* Card Action Controls */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
          <Link
            to={`/posts/${blog._id}`}
            className="text-xs font-semibold text-zinc-900 hover:underline flex items-center gap-1"
          >
            <span>Read Story</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={`/posts/${blog._id}/edit`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-zinc-900 transition px-2.5 py-1 rounded hover:bg-zinc-100 border border-zinc-200"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>

            <button
              type="button"
              onClick={() => onDeleteClick(blog._id)}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-800 transition px-2.5 py-1 rounded hover:bg-rose-50 border border-transparent hover:border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStoryCard;
