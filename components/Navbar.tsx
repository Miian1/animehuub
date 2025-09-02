
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { searchAnime } from '../services/jikanApi';
import { Anime } from '../types';

const DICEBEAR_API = 'https://api.dicebear.com/8.x/micah/svg?seed=';

const Navbar: React.FC = () => {
  const { session, user, logout } = useAuth();
  const [dropdownActive, setDropdownActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Search state
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Anime[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Hamburger menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
      return;
    }

    setIsSearching(true);
    const debounceTimer = setTimeout(async () => {
      const results = await searchAnime(query, 1, 5);
      setSuggestions(results?.data || []);
      setIsSuggestionsVisible(true);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownActive(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url || `${DICEBEAR_API}${user?.id}`;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query.trim()}`);
      setQuery('');
      setIsSuggestionsVisible(false);
    }
  };
  
  const handleSuggestionClick = () => {
      setQuery('');
      setIsSuggestionsVisible(false);
  };
  
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 z-[51] w-full bg-[#1a1a2e] shadow-lg">
        <div className="flex flex-wrap items-center justify-between px-5 py-4 mx-auto">
          <div className="flex items-center order-1">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="mr-4 text-white text-2xl focus:outline-none"
                aria-label="Open menu"
            >
                <i className="fas fa-bars"></i>
            </button>
            <Link to="/" className="text-2xl font-bold text-[#e94560]">
              Anime<span className="text-white">HUB</span>
            </Link>
          </div>

          <div ref={searchContainerRef} className="relative flex-grow max-w-md mx-4 order-3 sm:order-2 mt-4 sm:mt-0">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search anime..."
                className="w-full h-11 py-2 pl-4 pr-12 text-white bg-[#16213e] rounded-full focus:outline-none focus:ring-2 focus:ring-[#e94560]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length > 2 && setIsSuggestionsVisible(true)}
                autoComplete="off"
              />
              <button type="submit" className="absolute top-6 -translate-y-1/2 right-1 h-10 w-10 text-white bg-[#e94560] hover:bg-opacity-80 transition-colors rounded-full flex items-center justify-center">
                {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <i className="fas fa-search"></i>}
              </button>
            </form>

            {isSuggestionsVisible && suggestions.length > 0 && (
               <div className="absolute mt-2 w-full bg-[#16213e] rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto card-grid">
                <ul>
                  {suggestions.map(anime => (
                    <li key={anime.mal_id}>
                      <Link 
                        to={`/search?q=${encodeURIComponent(anime.title)}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center p-2 hover:bg-[#e94560] transition-colors"
                      >
                        <img src={anime.images.jpg.image_url} alt={anime.title} className="w-10 h-14 object-cover rounded-md mr-3 flex-shrink-0" />
                        <span className="text-white font-semibold truncate">{anime.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="relative order-2 sm:order-3">
            {session ? (
              <div ref={dropdownRef}>
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#e94560] cursor-pointer"
                  onClick={() => setDropdownActive(!dropdownActive)}
                />
                {dropdownActive && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#16213e] rounded-md shadow-xl z-20">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-[#e94560]"
                      onClick={() => setDropdownActive(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#e94560]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-white bg-[#e94560] rounded-md font-bold hover:bg-opacity-80 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      <div 
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-72 bg-[#16213e] shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#e94560] mb-8">Menu</h2>
          <ul className="space-y-3">
            <li><Link to="/" onClick={closeMenu} className="flex items-center gap-4 w-full text-left p-3 text-lg text-white hover:bg-[#e94560] rounded-md transition-colors duration-200"><i className="fas fa-home w-6 text-center"></i>Home</Link></li>
            <li><Link to="/schedule" onClick={closeMenu} className="flex items-center gap-4 w-full text-left p-3 text-lg text-white hover:bg-[#e94560] rounded-md transition-colors duration-200"><i className="fas fa-calendar-alt w-6 text-center"></i>Schedule</Link></li>
            <li><Link to="/browse?title=Top%20Movies&endpoint=%2Ftop%2Fanime%3Ftype%3Dmovie" onClick={closeMenu} className="flex items-center gap-4 w-full text-left p-3 text-lg text-white hover:bg-[#e94560] rounded-md transition-colors duration-200"><i className="fas fa-film w-6 text-center"></i>Movies</Link></li>
            <li><Link to="/news" onClick={closeMenu} className="flex items-center gap-4 w-full text-left p-3 text-lg text-white hover:bg-[#e94560] rounded-md transition-colors duration-200"><i className="fas fa-newspaper w-6 text-center"></i>News</Link></li>
            <li><Link to="/reviews" onClick={closeMenu} className="flex items-center gap-4 w-full text-left p-3 text-lg text-white hover:bg-[#e94560] rounded-md transition-colors duration-200"><i className="fas fa-star-half-alt w-6 text-center"></i>Reviews</Link></li>
          </ul>
        </div>
      </div>
      
      {isMenuOpen && <div onClick={closeMenu} className="fixed inset-0 bg-black/60 z-50"></div>}
    </>
  );
};

export default Navbar;
