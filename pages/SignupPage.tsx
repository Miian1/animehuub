
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    setError('');
    setMessage('');
    setLoading(true);

    const { error } = await signup({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Registration successful! Please check your email to verify your account.");
      setTimeout(() => navigate('/login'), 5000);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#1a1a2e] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#e94560]">Create your Account</h2>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded text-center">{error}</p>}
        {message && <p className="text-green-500 bg-green-100 p-3 rounded text-center">{message}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
            <input
              id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-white bg-[#16213e] border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#e94560] focus:border-[#e94560]"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-300">Password</label>
            <input
              id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-white bg-[#16213e] border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#e94560] focus:border-[#e94560]"
            />
          </div>
           <div>
            <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-300">Confirm Password</label>
            <input
              id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-white bg-[#16213e] border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#e94560] focus:border-[#e94560]"
            />
          </div>
          <div>
            <button
              type="submit" disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e94560] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e94560] disabled:bg-gray-500"
            >
              {loading ? <Spinner /> : 'Sign up'}
            </button>
          </div>
        </form>
         <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#e94560] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
