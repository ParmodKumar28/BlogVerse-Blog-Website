import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  blogsSelector,
  fetchBlogsAsync,
  deleteBlogAsync,
} from "../../Redux/reducers/blogsReducer";
import {
  usersSelector,
  updateProfileAsync,
} from "../../Redux/reducers/usersReducer";
import ConfirmModal from "../common/ConfirmModal";
import { ProfileSkeleton } from "../common/Skeleton";
import AuthorProfileCard from "./AuthorProfileCard";
import UserStoryCard from "./UserStoryCard";
import { toast } from "react-toastify";
import { PenSquare } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blogs, isLoading: blogsLoading } = useSelector(blogsSelector);
  const { signedUser, isSignIn, sessionRestored, profileLoading } =
    useSelector(usersSelector);

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (sessionRestored && !isSignIn) {
      navigate("/login");
    }
  }, [sessionRestored, isSignIn, navigate]);

  useEffect(() => {
    if (isSignIn) {
      dispatch(fetchBlogsAsync());
    }
  }, [dispatch, isSignIn]);

  // Show skeleton while session is being restored or blogs loading
  if (!sessionRestored || blogsLoading) {
    return <ProfileSkeleton />;
  }

  if (!isSignIn || !signedUser) return null;

  // Filter to only this author's blogs
  const blogsArray = Array.isArray(blogs) ? blogs : [];
  const userBlogs = blogsArray.filter((b) => {
    const blogUserId = b.user?._id || b.user;
    const currentUserId = signedUser._id;
    const byId =
      blogUserId &&
      currentUserId &&
      blogUserId.toString() === currentUserId.toString();
    const byUsername =
      b.user?.username &&
      signedUser.username &&
      b.user.username.toLowerCase() === signedUser.username.toLowerCase();
    return byId || byUsername;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteBlogAsync(deleteTargetId)).unwrap();
      setDeleteTargetId(null);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to delete story");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Local preview
    setImagePreview(URL.createObjectURL(file));
    // Upload immediately
    const formData = new FormData();
    formData.append("profileImage", file);
    dispatch(updateProfileAsync(formData));
  };

  const hostLink =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";
  const hostLinkUpdated = hostLink.replace("/api", "");

  const profileImageSrc =
    imagePreview ||
    (signedUser?.profileImage
      ? `${hostLinkUpdated}${signedUser.profileImage}`
      : null);
  const initial = signedUser?.username
    ? signedUser.username.charAt(0).toUpperCase()
    : "A";


  return (
    <div className="min-h-dvh px-4 py-10 pb-20 bg-zinc-50/50 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Author Profile Header Card */}
        <AuthorProfileCard
          username={signedUser?.username || "Author"}
          email={signedUser?.email || ""}
          storyCount={userBlogs.length}
          profileImage={profileImageSrc}
          initial={initial}
          profileLoading={profileLoading}
          onUploadClick={() => fileInputRef.current?.click()}
        />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Published Stories */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <h2 className="text-xl font-bold font-serif-editorial text-zinc-900">
              My Published Stories ({userBlogs.length})
            </h2>
          </div>

          {userBlogs.length === 0 ? (
            <div className="p-8 py-16 space-y-3 text-center bg-white border rounded-2xl border-zinc-200">
              <div className="flex items-center justify-center w-12 h-12 mx-auto text-xl rounded-full bg-zinc-100 text-zinc-400">
                ✍️
              </div>
              <h3 className="text-lg font-bold text-zinc-800 font-serif-editorial">
                No Stories Yet
              </h3>
              <p className="max-w-sm mx-auto text-xs text-zinc-500">
                Share your ideas, tutorials, and engineering perspectives with
                the community.
              </p>
              <Link
                to="/posts/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition mt-2"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Write Your First Story</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userBlogs.map((blog, idx) => (
                <UserStoryCard
                  key={blog._id}
                  blog={blog}
                  index={idx}
                  onDeleteClick={setDeleteTargetId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Story"
        message="Are you sure you want to permanently delete this story? This action cannot be undone."
        confirmText="Delete Story"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

export default Profile;
