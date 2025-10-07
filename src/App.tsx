// src/App.tsx
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <>
      <title>Rajin's A.R.I.A.</title>
      <meta name="description" content="Meet A.R.I.A., the personal AI assistant for Rajin Khan. Ask anything about his skills, projects, experience, and professional background." />
      <link rel="canonical" href="https://aria-lite.vercel.app/" />

      <div className="h-screen w-screen bg-neutral-950 overflow-hidden">
        <ChatInterface />
      </div>
    </>
  );
}

export default App;