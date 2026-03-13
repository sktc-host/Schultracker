function Nav({ active, onChange, dark, setDark, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = ['Dashboard', 'Kalender', 'Stundenplan', 'Experimente', 'Einstellungen'];

  return (
    <header className="bg-white/75 dark:bg-slate-800/75 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[64px]">
          <div className="flex items-center gap-4">
            <a href="#" onClick={() => onChange('Dashboard')} className="text-indigo-600 dark:text-indigo-400 font-extrabold text-lg flex items-center gap-2">
              <img src="applogo.jpeg" className="w-8 h-8 rounded-full" alt="Schultracker Logo" />
              <span className="hidden sm:inline">Schultracker</span>
            </a>
          </div>
          
          <nav className="hidden md:flex gap-1">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => onChange(item)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${active === item
                  ? 'bg-indigo-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
              {dark ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>}
            </button>
            {user && (
              <div className="relative group">
                <button className="flex items-center gap-2">
                  <img src={user.photoURL || 'https://via.placeholder.com/32'} alt={user.displayName} className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-indigo-500" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <div className="p-2">
                    <div className="text-sm text-slate-600 dark:text-slate-300 px-2 py-1">{user.displayName}</div>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                    <a href="index.html" className="block w-full text-left px-2 py-2 text-sm rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Stable Version</a>
                    <button onClick={onLogout} className="block w-full text-left px-2 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Hauptmenü öffnen</span>
                {isMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <button
                key={item}
                onClick={() => {
                  onChange(item);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md font-medium ${active === item
                  ? 'bg-indigo-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
            {user && (
              <div className="flex items-center px-5 mb-3">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={user.photoURL || 'https://via.placeholder.com/40'} alt={user.displayName} />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-slate-800 dark:text-white">{user.displayName}</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{user.email}</div>
                </div>
              </div>
            )}
            <div className="mt-3 px-2 space-y-1">
              <a href="index.html" className="block px-3 py-2 rounded-md font-medium text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700">
                Zur Stable-Version
              </a>
              {user && (
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
