import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { blogsSelector, fetchBlogsAsync } from '../../Redux/reducers/blogsReducer';
import { usersSelector } from '../../Redux/reducers/usersReducer';
import { FeaturedHeroSkeleton, BlogCardSkeleton } from '../common/Skeleton';
import CategoryTabs from './CategoryTabs';
import FeaturedHeroCard from './FeaturedHeroCard';
import BlogGridCard from './BlogGridCard';

const Home = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector(blogsSelector);
  const { signedUser } = useSelector(usersSelector);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchBlogsAsync());
  }, [dispatch]);

  const blogsArray = Array.isArray(blogs) ? blogs : [];

  const filteredBlogs = selectedCategory === "All"
    ? blogsArray
    : blogsArray.filter((b) => b.category?.toLowerCase() === selectedCategory.toLowerCase());

  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const secondaryBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : (selectedCategory !== "All" ? filteredBlogs : []);

  return (
    <div className="min-h-dvh bg-zinc-50/50 pb-20">
      {/* Editorial Header Section */}
      <section className="border-b border-zinc-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Blogverse
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 font-serif-editorial leading-tight">
              Your Universe of Ideas
            </h1>
            <p className="text-zinc-500 text-base sm:text-lg font-normal leading-relaxed">
              Curated articles, practical tutorials, and insights written by builders and engineers.
            </p>
          </div>

          {/* Category Tabs */}
          <CategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="space-y-12">
            <FeaturedHeroSkeleton />
            <div className="space-y-6">
              <div className="w-36 h-6 bg-zinc-200/80 rounded-md border-b border-zinc-200 pb-2 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <BlogCardSkeleton key={num} />
                ))}
              </div>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200 p-8">
            <h3 className="text-xl font-bold text-zinc-800 mb-1 font-serif-editorial">No Stories Published</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
              No articles are available in the <span className="font-semibold text-zinc-700">{selectedCategory}</span> topic yet.
            </p>
            <Link
              to="/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition"
            >
              Write First Story
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Hero Story */}
            {featuredBlog && (
              <FeaturedHeroCard blog={featuredBlog} signedUser={signedUser} />
            )}

            {/* Secondary Articles Grid */}
            {secondaryBlogs.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-900 font-serif-editorial border-b border-zinc-200 pb-3">
                  {selectedCategory === 'All' ? 'More Stories' : `${selectedCategory} Articles`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {secondaryBlogs.map((blog, idx) => (
                    <BlogGridCard
                      key={blog._id}
                      blog={blog}
                      index={idx + 1}
                      signedUser={signedUser}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
