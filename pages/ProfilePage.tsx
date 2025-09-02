
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';

const DICEBEAR_API = 'https://api.dicebear.com/8.x/micah/svg?seed=';

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata.full_name || '');
      setAvatarUrl(user.user_metadata.avatar_url || `${DICEBEAR_API}${user.id}`);
    }
  }, [user]);

  const handleGenerateAvatar = () => {
    // Generate a new random avatar URL from DiceBear
    const newAvatar = `${DICEBEAR_API}${Date.now()}`;
    setAvatarUrl(newAvatar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error } = await updateUserProfile({
      data: { full_name: fullName, avatar_url: avatarUrl }
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Profile updated successfully!');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-[#1a1a2e] rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-[#e94560] mb-6">My Profile</h2>

        {message && <p className="text-green-500 bg-green-100 p-3 rounded text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <img src={avatarUrl} alt="Profile Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-[#e94560]" />
            <button
              type="button"
              onClick={handleGenerateAvatar}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md"
            >
              Generate New Avatar
            </button>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="email"
              type="email"
              value={user.email || ''}
              disabled
              className="block w-full px-3 py-2 mt-1 text-gray-400 bg-[#10101f] border border-gray-600 rounded-md cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full px-3 py-2 mt-1 text-white bg-[#16213e] border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#e94560] focus:border-[#e94560]"
              placeholder="Your Name"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e94560] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e94560] disabled:bg-gray-500"
            >
              {loading ? <Spinner /> : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
