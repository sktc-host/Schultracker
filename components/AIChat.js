function AIChat({ settings, setSettings }) {
  const [apiKey, setApiKey] = React.useState(() => localStorage.getItem('ai_chat_api_key') || '');
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    localStorage.setItem('ai_chat_api_key', apiKey);
  }, [apiKey]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !apiKey) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: newMessages.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text }))
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.choices[0].message.content }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Entschuldigung, ich konnte keine Antwort erhalten.' }]);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Es gab ein Problem beim Senden deiner Nachricht.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg card-hover flex flex-col h-[600px]">
      <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">🤖 AI Chat</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">OpenAI API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-3 mb-4 bg-slate-50 dark:bg-slate-700">
        {messages.length === 0 && <p className="text-sm text-slate-500 italic">Starte ein Gespräch mit der KI!</p>}
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left mb-2">
            <span className="inline-block px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 animate-pulse">
              Denkt nach...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
          placeholder="Nachricht an die KI..."
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          disabled={!apiKey || loading}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed"
          disabled={!input.trim() || !apiKey || loading}
        >
          Senden
        </button>
      </div>
    </div>
  );
}
