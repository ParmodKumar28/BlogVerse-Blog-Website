import { useNavigate } from 'react-router-dom';
import {
  getBlogCoverImage,
  getFormattedCategory,
  getAuthorName,
  getAccurateReadTime,
} from '../../utils/blogHelpers';

const BlogGridCard = ({ blog, index, signedUser }) => {
  const navigate = useNavigate();
  if (!blog) return null;

  const coverImg = getBlogCoverImage(blog, index);
  const authorName = getAuthorName(blog, signedUser);
  const readTime = getAccurateReadTime(blog);
  const formattedCat = getFormattedCategory(blog.category);
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <article
      onClick={() => navigate(`/posts/${blog._id}`)}
      className="editorial-card rounded-xl overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-zinc-400 hover:shadow-md transition duration-200"
    >
      <div>
        <div className="aspect-[16/9] overflow-hidden bg-zinc-100 relative">
          <img
            src={coverImg}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="tag-pill bg-white/90 backdrop-blur-xs border-zinc-200">
              {formattedCat}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h4 className="text-lg font-bold text-zinc-900 font-serif-editorial leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition">
            {blog.title}
          </h4>
          <p className="text-zinc-600 text-xs leading-relaxed line-clamp-2">
            {blog.subtitle || (blog.content ? blog.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : '')}
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 pt-0 flex items-center justify-between border-t border-zinc-100 mt-auto pt-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center text-[10px]">
            {authorInitial}
          </div>
          <span className="text-[11px] font-semibold text-zinc-700">{authorName}</span>
        </div>
        <span className="text-[11px] text-zinc-400 font-medium">{readTime}</span>
      </div>
    </article>
  );
};

export default BlogGridCard;
