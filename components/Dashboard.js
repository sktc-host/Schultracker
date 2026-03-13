function Dashboard({ now, vacations, todos, setTodos, viewDate, setViewDate, user }) {
  const DEFAULT_PUBLIC_HOLIDAYS = [
    "2025-10-03", "2025-11-01", "2025-12-25", "2025-12-26", "2026-01-01", "2026-01-06",
    "2026-04-03", "2026-04-06", "2026-05-01", "2026-05-14", "2026-05-25", "2026-06-04", "2026-07-10"
  ];

  function dateAddDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return new Date(x.getFullYear(), x.getMonth(), x.getDate());
  }

  function iterateDates(from, to) {
    const arr = [];
    let cur = new Date(from);
    while (cur <= to) {
      arr.push(new Date(cur));
      cur = dateAddDays(cur, 1);
    }
    return arr;
  }

  const parsedVacations = React.useMemo(() => {
    const out = {};
    Object.entries(vacations).forEach(([k, v]) => {
      if (!v || !v.from) return (out[k] = null);
      out[k] = { from: toDateISOLocal(v.from), to: toDateISOLocal(v.to) };
    });
    return out;
  }, [vacations]);

  const parsedPublicHolidays = React.useMemo(() => new Set(DEFAULT_PUBLIC_HOLIDAYS.map(d => toDateISOLocal(d).toDateString())), []);

  const schoolStart = toDateISOLocal('2025-09-14');
  const schoolEnd = toDateISOLocal('2026-07-29');

  function isSchoolDay(d) {
    const day = d.getDay();
    if (day === 0 || day === 6) return false;
    if (parsedPublicHolidays.has(d.toDateString())) return false;
    for (const v of Object.values(parsedVacations)) {
      if (!v) continue;
      if (d >= v.from && d <= v.to) return false;
    }
    if (d < schoolStart || d > schoolEnd) return false;
    return true;
  }

  const days = iterateDates(schoolStart, schoolEnd);
  const total = days.reduce((acc, d) => acc + (isSchoolDay(d) ? 1 : 0), 0);
  const passed = iterateDates(schoolStart, now).reduce((acc, d) => acc + (isSchoolDay(d) && d <= now ? 1 : 0), 0);
  const percent = total ? Math.max(0, Math.min(100, Math.round((passed / total) * 100))) : 0;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTodos = todos.filter(t => t.date === todayStr);

  const greeting = `Hallo, ${user?.displayName?.split(' ')[0] || 'Gast'}!`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900 rounded-3xl p-6 sm:p-8 shadow-xl text-white card-hover">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{greeting}</h2>
            <p className="text-indigo-100 text-xs sm:text-sm mt-1">Schuljahr Fortschritt 2025/2026</p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <div className="text-2xl sm:text-3xl font-bold mono-time">{now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-xs text-indigo-200">{formatDate(now)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-bold">{passed}</div>
            <div className="text-xs text-indigo-100 mt-1">Tage vorbei</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-bold">{total - passed}</div>
            <div className="text-xs text-indigo-100 mt-1">Tage übrig</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-bold">{percent}%</div>
            <div className="text-xs text-indigo-100 mt-1">Fertig</div>
          </div>
        </div>

        <div className="w-full bg-white/20 rounded-full h-3 sm:h-4 overflow-hidden backdrop-blur-sm">
          <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
        </div>
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-indigo-100">Noch {total - passed} Schultage bis zum Sommer!</div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg card-hover">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Nächste Ferien</h3>
          <div className="space-y-3">
            {Object.entries(parsedVacations).filter(([, v]) => v && v.from > now).slice(0, 3).map(([k, v]) => (
              <div key={k} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border-l-4 border-indigo-500">
                <div className="font-medium text-sm text-slate-800 dark:text-slate-200">{k}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {formatDate(v.from)} - {formatDate(v.to)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg card-hover">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">📋 Heute ({todayTodos.length})</h3>
          <div className="space-y-2 max-h-32 sm:max-h-48 overflow-y-auto">
            {todayTodos.length === 0 ? (
              <p className="text-sm text-slate-500">Keine Todos für heute.</p>
            ) : (
              todayTodos.map(t => (
                <div key={t.id} className="btn-simple flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                  <button
                    onClick={() => setTodos(d => d.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs flex-shrink-0 ${t.done
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-500'
                      }`}
                  >
                    {t.done && '✓'}
                  </button>
                  <span className={`text-sm flex-1 ${t.done ? 'line-through text-slate-400' : ''}`}>{t.title}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
