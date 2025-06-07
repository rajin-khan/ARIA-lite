// src/App.tsx
import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <ChatInterface />
    </div>
  );
}

export default App;