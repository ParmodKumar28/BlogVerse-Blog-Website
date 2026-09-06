import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchBlogByIdAsync, deleteBlogAsync, blogsSelector } from '../../Redux/reducers/blogsReducer';
import { usersSelector } from '../../Redux/reducers/usersReducer';
import ConfirmModal from '../common/ConfirmModal';
import FormattedContent from '../common/FormattedContent';
import { ArticleDetailSkeleton } from '../common/Skeleton';
import {
  getBlogCoverImage,
  getAuthorName,
  getAccurateReadTime,
  getFormattedCategory,
  getFormattedDate,
} from '../../utils/blogHelpers';
import { toast } from 'react-toastify';
import { ArrowLeft, Clock, Trash2, Edit3 } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blog, isLoading } = useSelector(blogsSelector);
  const { signedUser, isSignIn } = useSelector(usersSelector);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogByIdAsync(id));
  }, [dispatch, id]);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteBlogAsync(id)).unwrap();
      setIsConfirmOpen(false);
      navigate('/');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !blog) {
    return <ArticleDetailSkeleton />;
  }

  const coverImg = getBlogCoverImage(blog);
  const authorName = getAuthorName(blog, signedUser);
  const readTime = getAccurateReadTime(blog);
  const formattedCategory = getFormattedCategory(blog.category);
  const formattedDate = getFormattedDate(blog.createdAt);

  const blogUserId = blog.user?._id || blog.user;
  const currentUserId = signedUser?._id;
  const isOwner = isSignIn && currentUserId && blogUserId && (blogUserId.toString() === currentUserId.toString() || blog.user?.username === signedUser?.username);

  return (
    <div className="min-h-dvh bg-white py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation & Actions Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <Link
            to="/"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Articles</span>
          </Link>

          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                to={`/posts/${id}/edit`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-800 hover:text-zinc-900 transition px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Article</span>
              </Link>

              <button
                onClick={() => setIsConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 transition px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Article</span>
              </button>
            </div>
          )}
        </div>

        {/* Article Meta & Title Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="tag-pill">{formattedCategory}</span>
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-editorial text-zinc-900 leading-tight">
            {blog.title}
          </h1>

          {blog.subtitle && (
            <p className="text-lg sm:text-xl font-serif-editorial italic text-zinc-600 font-normal leading-relaxed">
              {blog.subtitle}
            </p>
          )}

          {/* Author Byline Bar */}
          <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
            <div className="w-9 h-9 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-900">{authorName}</p>
              <p className="text-[11px] text-zinc-400 font-medium">Published on {formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        {coverImg && (
          <div className="w-full h-72 sm:h-96 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/80">
            <img
              src={coverImg}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Formatted Article Content */}
        <FormattedContent content={blog.content} className="pt-2" />

      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Article"
        message="Are you sure you want to permanently delete this article? This action cannot be undone."
        confirmText="Delete Permanently"
        cancelText="Keep Article"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default BlogDetail;
