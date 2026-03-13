function FeatureToggles({ settings, setSettings }) {
  function toggle(key) {
    setSettings(s => ({ ...s, [key]: !s[key] }));
  }

  function updateColor(key, value) {
    setSettings(s => ({ ...s, [key]: value }));
  }

  const toggles = [
    { k: 'timeSimulator', t: '⏱️ Time Simulator' },
    { k: 'autoAlerts', t: '🔔 Auto Alerts' },
    { k: 'animationsEnabled', t: '✨ Animationen' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold mb-4">🎨 Farbschema</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400">Primärfarbe</label>
            <div className="flex gap-2 mt-2">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => updateColor('primaryColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400">Sekundärfarbe</label>
            <div className="flex gap-2 mt-2">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => updateColor('secondaryColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400">Akzentfarbe</label>
            <div className="flex gap-2 mt-2">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => updateColor('accentColor', e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold mb-4">⚙️ Display-Einstellungen</h3>
        <div className="space-y-3">
          {[{ k: 'compactMode', t: '💾 Kompakt-Modus' }, { k: 'animationsEnabled', t: '✨ Animationen' }].map(t => (
            <div key={t.k} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="text-sm">{t.t}</div>
              <button
                onClick={() => toggle(t.k)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${settings[t.k]
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-600'
                  }`}
              >
                {settings[t.k] ? 'An' : 'Aus'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold mb-4">🧪 Experimentelle Features</h3>
        <div className="space-y-3">
          {toggles.map(t => (
            <div key={t.k} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="text-sm">{t.t}</div>
              <button
                onClick={() => toggle(t.k)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${settings[t.k]
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-600'
                  }`}
              >
                {settings[t.k] ? 'Aktiv' : 'Inaktiv'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
