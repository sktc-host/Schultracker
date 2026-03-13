function Calendar({ todos, setTodos, viewDate, setViewDate }) {
  const [inputTitle, setInputTitle] = React.useState('');
  const [selectedDateKey, setSelectedDateKey] = React.useState(null);
  const inputRef = React.useRef(null);

  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function endOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }

  const start = startOfMonth(viewDate);
  const end = endOfMonth(viewDate);
  const startWeekday = start.getDay();

  const days = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let d = 1; d <= end.getDate(); d++) days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));

  function nextMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function prevMonth() {
    setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function dateKey(d) {
    if (!d) return null;
    return d.toISOString().split('T')[0];
  }

  function todosForDate(key) {
    if (!key) return [];
    return todos.filter(t => t.date === key);
  }

  function selectDate(day) {
    if (!day) return;
    const key = dateKey(day);
    setSelectedDateKey(key);
    setInputTitle('');
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  }

  function closeDialog() {
    setSelectedDateKey(null);
    setInputTitle('');
  }

  function addTodo() {
    if (!inputTitle.trim() || !selectedDateKey) return;
    const newTodo = { id: Date.now(), title: inputTitle.trim(), date: selectedDateKey, done: false };
    setTodos(t => [...t, newTodo]);
    setInputTitle('');
    if (inputRef.current) inputRef.current.focus();
  }

  function toggleDone(id) {
    setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  }

  function removeTodo(id) {
    setTodos(t => t.filter(x => x.id !== id));
  }

  const todayKey = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg card-hover">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Kalender</h3>
          <div className="text-sm text-slate-500">{viewDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="btn-simple px-3 py-1 sm:px-4 sm:py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
            ←
          </button>
          <button onClick={nextMonth} className="btn-simple px-3 py-1 sm:px-4 sm:py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-center text-slate-600 dark:text-slate-400 mb-2">
        {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(d => (
          <div key={d} className="sm:hidden">{d.slice(0, 1)}</div>
        ))}
        {['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'].map(d => (
            <div key={d} className="hidden sm:block">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day, idx) => {
          const key = day ? dateKey(day) : null;
          const isToday = key === todayKey;
          const dayTodos = todosForDate(key);
          const isSelected = selectedDateKey === key;

          return (
            <div
              key={idx}
              className={`day-cell min-h-[50px] sm:min-h-[80px] md:min-h-[100px] p-1 sm:p-2 rounded-lg border-2 cursor-pointer transition ${day
                ? isSelected
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-500'
                  : 'bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                : 'bg-transparent border-transparent pointer-events-none'
                }`}
              onClick={() => { if (day) selectDate(day); }}
            >
              {day && (
                <div className="h-full flex flex-col">
                  <div className={`text-center font-semibold text-xs sm:text-sm ${isToday
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full mx-auto'
                    : 'text-slate-800 dark:text-slate-200'
                    }`}>
                    {day.getDate()}
                  </div>
                  <div className="mt-1 flex-1 space-y-1 text-[10px] sm:text-xs hidden sm:block">
                    {dayTodos.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        className={`px-1 sm:px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 truncate pointer-events-none ${t.done ? 'line-through opacity-50' : ''}`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTodos.length > 2 && (
                      <div className="text-[10px] sm:text-xs text-slate-500 pointer-events-none">+{dayTodos.length - 2}</div>
                    )}
                  </div>
                  {dayTodos.length > 0 && (
                     <div className="sm:hidden mt-1 flex justify-center items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                     </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDateKey && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-2 border-indigo-300 dark:border-indigo-600">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h4 className="text-sm sm:text-base font-bold text-indigo-900 dark:text-indigo-100">
              {new Date(selectedDateKey + 'T00:00:00').toLocaleDateString('de-DE', {
                weekday: 'long',
                day: '2-digit',
                month: 'long'
              })}
            </h4>
            <button onClick={closeDialog} className="btn-simple text-lg sm:text-xl text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200">
              ✕
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              ref={inputRef}
              type="text"
              value={inputTitle}
              onChange={e => setInputTitle(e.target.value)}
              placeholder="Neues Todo hinzufügen..."
              className="flex-1 px-3 py-2 border-2 border-indigo-200 dark:border-indigo-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputTitle.trim()) {
                  e.preventDefault();
                  addTodo();
                }
              }}
            />
            <button
              onClick={addTodo}
              disabled={!inputTitle.trim()}
              className="btn-simple px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold"
            >
              Hinzufügen
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {todosForDate(selectedDateKey).length === 0 ? (
              <p className="text-sm text-indigo-600 dark:text-indigo-300 italic">Noch keine Todos für diesen Tag.</p>
            ) : (
              <>
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                  Todos für den {new Date(selectedDateKey + 'T00:00:00').toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit'})}
                </p>
                {todosForDate(selectedDateKey).map(t => (
                  <div key={t.id} className="btn-simple flex items-center gap-3 p-2 bg-white dark:bg-slate-700/50 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                    <button
                      onClick={() => toggleDone(t.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm flex-shrink-0 btn-simple ${t.done
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-500 hover:border-emerald-500'
                        }`}
                    >
                      {t.done && '✓'}
                    </button>
                    <span className={`flex-1 text-sm ${t.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                      {t.title}
                    </span>
                    <button
                      onClick={() => removeTodo(t.id)}
                      className="btn-simple text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm px-2 py-1 rounded"
                    >
                      Löschen
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
