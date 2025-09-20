
import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ScanPage from './components/ScanPage';
import { Page, ScanMode } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scanMode, setScanMode] = useState<ScanMode>('prescription');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const startScan = (mode: ScanMode) => {
    setScanMode(mode);
    setCurrentPage('scan');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onStartScan={startScan} />;
      case 'scan':
        return <ScanPage mode={scanMode} />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onStartScan={startScan} />;
    }
  };

  return (
    <div className="bg-brand-light min-h-screen text-brand-dark font-sans flex flex-col">
      <Header onNavigate={navigateTo} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderPage()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>MediVoice Senior &copy; 2024. A tool to help you understand your medicines.</p>
      </footer>
    </div>
  );
};

export default App;
