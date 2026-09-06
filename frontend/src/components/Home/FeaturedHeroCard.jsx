import { useNavigate } from 'react-router-dom';
import {
  getBlogCoverImage,
  getFormattedCategory,
  getAuthorName,
  getAccurateReadTime,
} from '../../utils/blogHelpers';

const FeaturedHeroCard = ({ blog, signedUser }) => {
  const navigate = useNavigate();
  if (!blog) return null;

  const coverImg = getBlogCoverImage(blog, 0);
  const authorName = getAuthorName(blog, signedUser);
  const readTime = getAccurateReadTime(blog);
  const categoryTag = getFormattedCategory(blog.category);
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article
      onClick={() => navigate(`/posts/${blog._id}`)}
      className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-xs hover:border-zinc-400 hover:shadow-md transition duration-200 group cursor-pointer"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Cover Image */}
        <div className="md:col-span-7 aspect-[16/10] md:aspect-auto overflow-hidden bg-zinc-100">
          <img
            src={coverImg}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
          />
        </div>

        {/* Story Metadata & Summary */}
        <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="tag-pill">{categoryTag}</span>
              <span className="text-xs text-zinc-400 font-medium">{readTime}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-serif-editorial leading-tight group-hover:text-blue-600 transition">
              {blog.title}
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed line-clamp-3 font-normal">
              {blog.subtitle || (blog.content ? blog.content.replace(/<[^>]*>/g, '').substring(0, 140) + '...' : '')}
            </p>
          </div>

          <div className="pt-6 border-t border-zinc-100 flex items-center justify-between mt-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                {authorInitial}
              </div>
              <span className="text-xs font-semibold text-zinc-800">{authorName}</span>
            </div>
            <span className="text-xs font-semibold text-zinc-900 group-hover:translate-x-1 transition flex items-center gap-1">
              Read Article <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeaturedHeroCard;
