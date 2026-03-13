// Schultracker Beta - App Logic
const { useState, useEffect, useMemo } = React;

const DEFAULT_VACATIONS = {
  Herbstferien: { from: "2025-10-25", to: "2025-11-02" },
  Weihnachtsferien: { from: "2025-12-20", to: "2026-01-06" },
  Fasnachtsferien: { from: "2026-02-13", to: "2026-02-22" },
  Osterferien: { from: "2026-03-28", to: "2026-04-12" },
  Pfingstferien: { from: "2026-05-23", to: "2026-06-07" },
  Sommerferien: { from: "2026-07-30", to: "2026-09-13" }
};

function toDateISO(s) {
  if (!s) return null;
  const d = new Date(s + 'T00:00:00');
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toDateISOLocal(s) {
  if (!s) return null;
  const d = new Date(s + 'T00:00:00');
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDate(d) {
  if (!d) return '—';
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function useNow(interval = 10000, offsetMs = 0) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(t);
  }, [interval]);
  return useMemo(() => new Date(now.getTime() + offsetMs), [now, offsetMs]);
}

// The Nav component has been extracted to Schultracker/components/Nav.js

// The Calendar component has been extracted to Schultracker/components/Calendar.js

// The Dashboard component has been extracted to Schultracker/components/Dashboard.js

// The FeatureToggles component has been extracted to Schultracker/components/FeatureToggles.js

function BetaApp() {
  const [active, setActive] = useState('Dashboard');
  const [dark, setDark] = useState(() => JSON.parse(localStorage.getItem('beta_dark') || 'false'));
  const [vacations, setVacations] = useState(() => JSON.parse(localStorage.getItem('beta_vacations') || JSON.stringify(DEFAULT_VACATIONS)));
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('beta_settings') || JSON.stringify({
    timeSimulator: false,
    autoAlerts: false,
    newDesign: true,
    primaryColor: '#4f46e5',
    secondaryColor: '#7c3aed',
    accentColor: '#06b6d4',
    compactMode: false,
    animationsEnabled: true,
    cardStyle: 'elevated'
  })));
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('beta_todos') || '[]'));
  const [viewDate, setViewDate] = useState(() => {
    const saved = localStorage.getItem('beta_viewDate');
    if (saved) return new Date(saved);
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    if (!window.firebaseAuth) return;
    const unsubscribe = window.firebaseAuth.onAuthStateChanged(window.firebaseAuth.auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoginError(null);
      const provider = new window.firebaseAuth.GoogleAuthProvider();
      await window.firebaseAuth.signInWithPopup(window.firebaseAuth.auth, provider);
    } catch (err) {
      setLoginError('Google Login fehlgeschlagen: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await window.firebaseAuth.signOut(window.firebaseAuth.auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => { localStorage.setItem('beta_vacations', JSON.stringify(vacations)); }, [vacations]);
  useEffect(() => { localStorage.setItem('beta_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => {
    localStorage.setItem('beta_dark', JSON.stringify(dark));
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);
  useEffect(() => { localStorage.setItem('beta_todos', JSON.stringify(todos)); }, [todos]);
  useEffect(() => { localStorage.setItem('beta_viewDate', viewDate.toISOString()); }, [viewDate]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', settings.primaryColor);
    root.style.setProperty('--color-secondary', settings.secondaryColor);
    root.style.setProperty('--color-accent', settings.accentColor);
  }, [settings.primaryColor, settings.secondaryColor, settings.accentColor]);

  const now = useNow(1000, 13 * 1000);

  function handleExport() {
    const payload = { vacations, settings, dark, todos };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schultracker-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (data.vacations) setVacations(data.vacations);
        if (data.settings) setSettings(data.settings);
        if (typeof data.dark === 'boolean') setDark(data.dark);
        if (Array.isArray(data.todos)) setTodos(data.todos);
        alert('Import erfolgreich');
      } catch (err) {
        alert('Ungültige Datei');
      }
    };
    r.readAsText(f);
  }

  function handleReset() {
    if (confirm('Bist du sicher, dass du alle Daten zurücksetzen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      localStorage.removeItem('beta_vacations');
      localStorage.removeItem('beta_settings');
      localStorage.removeItem('beta_dark');
      localStorage.removeItem('beta_todos');
      localStorage.removeItem('beta_viewDate');
      window.location.reload();
    }
  }

  return (
    <div className="min-h-screen" style={{ '--color-primary': settings.primaryColor, '--color-secondary': settings.secondaryColor, '--color-accent': settings.accentColor }}>
      {loadingAuth && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Schultracker wird geladen...</p>
          </div>
        </div>
      )}

      {!loadingAuth && !user && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">Schultracker</h1>
              <p className="text-slate-600 dark:text-slate-400">Beta Version</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Melde dich mit deinem Google-Konto an</p>
            </div>

            {loginError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{loginError}</p>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-medium text-slate-800 dark:text-white shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Mit Google anmelden
            </button>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                🔒 Deine Daten werden sicher in Firebase gespeichert und synchronisiert.
              </p>
            </div>
          </div>
        </div>
      )}

      {!loadingAuth && user && (
        <>
          <Nav active={active} onChange={setActive} dark={dark} setDark={setDark} user={user} onLogout={handleLogout} />
          <main className={`max-w-7xl mx-auto ${settings.compactMode ? 'p-2 sm:p-4' : 'p-4 sm:p-6'}`}>
            {active === 'Dashboard' && (
              <>
                <Dashboard now={now} vacations={vacations} todos={todos} setTodos={setTodos} viewDate={viewDate} setViewDate={setViewDate} user={user} />
                <div className="mt-6 sm:mt-8">
                  <Calendar todos={todos} setTodos={setTodos} viewDate={viewDate} setViewDate={setViewDate} />
                </div>
              </>
            )}

            {active === 'Kalender' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Calendar todos={todos} setTodos={setTodos} viewDate={viewDate} setViewDate={setViewDate} />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg card-hover">
                  <h3 className="font-semibold mb-4">📋 Alle Todos ({todos.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {todos.length === 0 ? (
                      <p className="text-sm text-slate-500">Keine Todos. Füge im Kalender welche hinzu!</p>
                    ) : (
                      todos.map(t => (
                        <div key={t.id} className="btn-simple flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                          <button
                            onClick={() => setTodos(d => d.map(x => x.id === t.id ? {...x, done: !x.done} : x))}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs flex-shrink-0 ${t.done
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 dark:border-slate-500'
                              }`}
                          >
                            {t.done && '✓'}
                          </button>
                          <span className={`text-sm flex-1 ${t.done ? 'line-through text-slate-400' : ''}`}>{t.title}</span>
                          <span className="text-xs text-slate-400">{t.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {active === 'Stundenplan' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold">📅 Stundenplan</h2>
                <p className="text-sm text-slate-500 mt-2">Neue Stundenplan-Ansicht wird bald implementiert.</p>
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {['Mo', 'Di', 'Mi', 'Do', 'Fr'].map(day => (
                    <div key={day} className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-center">
                      <div className="font-semibold text-indigo-700 dark:text-indigo-300">{day}</div>
                      <div className="text-sm text-slate-600 mt-2">Coming Soon</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === 'Experimente' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold">🔬 Experimente</h2>
                <p className="text-sm text-slate-500 mt-2">Hier kannst du neue Features testen!</p>
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">💡 Diese Section enthält noch kaum Features. Überprüfe die Experimentelle Settings!</p>
                </div>
              </div>
            )}

            {active === 'Einstellungen' && (
              <div>
                <h2 className="text-2xl font-bold mb-2">⚙️ Einstellungen</h2>
                <p className="text-sm text-slate-500 mb-6">Personalisiere deine Schultracker Beta nach deinem Geschmack.</p>
                <FeatureToggles settings={settings} setSettings={setSettings} />

                <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-semibold mb-4">💾 Daten</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={handleExport} className="flex-1 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition">
                      📥 Alle Daten exportieren
                    </button>
                    <label className="flex-1 block">
                      <span className="sr-only">Datei importieren</span>
                      <input type="file" accept="application/json" onChange={handleImport} className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg w-full dark:bg-slate-700" />
                    </label>
                  </div>
                  <div className="mt-4">
                    <button onClick={handleReset} className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">
                      🔥 Alle Daten zurücksetzen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('beta-root')).render(<BetaApp />);
