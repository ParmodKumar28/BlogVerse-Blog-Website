import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signUpAsync, usersSelector } from '../../Redux/reducers/usersReducer';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signUpLoading } = useSelector(usersSelector);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signUpAsync({ email, username, password })).unwrap();
      setEmail('');
      setPassword('');
      setUsername('');
      navigate('/login');
    } catch (err) {
      // Error handling managed in thunk
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
            Join Blogverse
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Create an author account to start writing & publishing.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-zinc-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              required
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:border-zinc-900 outline-none transition"
            />
          </div>

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
            <input
              type="password"
              id="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 focus:border-zinc-900 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={signUpLoading}
            className="w-full py-2.5 bg-zinc-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition disabled:opacity-50"
          >
            {signUpLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-zinc-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-zinc-900 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
