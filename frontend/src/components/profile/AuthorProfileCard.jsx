import { Link } from 'react-router-dom';
import { Mail, BookOpen, PenSquare, Camera, Loader2 } from 'lucide-react';

const AuthorProfileCard = ({
  username,
  email,
  storyCount,
  profileImage,
  initial,
  profileLoading,
  onUploadClick,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

        {/* Avatar — profile picture or initial badge with upload overlay */}
        <div className="relative flex-shrink-0 group">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-zinc-900">
            {profileImage ? (
              <img
                src={profileImage}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl sm:text-4xl">
                {initial}
              </div>
            )}
          </div>

          {/* Upload overlay button */}
          <button
            type="button"
            onClick={onUploadClick}
            disabled={profileLoading}
            title="Change profile picture"
            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
          >
            {profileLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Upload indicator badge */}
          <button
            type="button"
            onClick={onUploadClick}
            disabled={profileLoading}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-zinc-900 text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-zinc-700 transition shadow-xs"
            title="Change profile picture"
          >
            {profileLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Profile Info */}
        <div className="space-y-3 text-center sm:text-left flex-1">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border border-zinc-200 rounded px-2 py-0.5 bg-zinc-50">
              Verified Author
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-editorial text-zinc-900 mt-1">
              {username}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              {email}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              {storyCount} {storyCount === 1 ? 'Published Story' : 'Published Stories'}
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 italic">
            Click the avatar to change your profile picture
          </p>
        </div>

        {/* Write New Story */}
        <Link
          to="/posts/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition shadow-xs self-center sm:self-start flex-shrink-0"
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>Write Story</span>
        </Link>

      </div>
    </div>
  );
};

export default AuthorProfileCard;
