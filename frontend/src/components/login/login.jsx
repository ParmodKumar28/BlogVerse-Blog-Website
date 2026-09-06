import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginAsync, usersSelector } from '../../Redux/reducers/usersReducer';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginLoading } = useSelector(usersSelector);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginAsync({ email, password })).unwrap();
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (err) {
      // Error handling is managed in thunk / toast
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-zinc-50/50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex w-9 h-9 rounded-lg bg-zinc-900 text-white items-center justify-center text-xs font-bold mb-2">
            bv
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 font-serif-editorial">
            Sign In to Blogverse
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Access your author dashboard and publishing tools.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:border-zinc-900 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-zinc-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:border-zinc-900 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-2.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition disabled:opacity-50"
          >
            {loginLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="text-center text-xs text-zinc-500 pt-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-zinc-900 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
