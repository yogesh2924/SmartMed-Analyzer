
import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ScanPage from './components/ScanPage';
import { Page, ScanMode, MedicineInfo } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scanMode, setScanMode] = useState<ScanMode>('prescription');
  const [prescription, setPrescription] = useState<MedicineInfo[] | null>(null);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const startScan = (mode: ScanMode) => {
    setScanMode(mode);
    setCurrentPage('scan');
  };

  const handlePrescriptionScanned = (newPrescription: MedicineInfo[]) => {
    setPrescription(newPrescription);
    navigateTo('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onStartScan={startScan} prescription={prescription} />;
      case 'scan':
        return <ScanPage 
                  mode={scanMode} 
                  prescription={prescription} 
                  onPrescriptionScanned={handlePrescriptionScanned}
                  onNavigateHome={() => navigateTo('home')}
                />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onStartScan={startScan} prescription={prescription} />;
    }
  };

  return (
    <div className="bg-brand-light min-h-screen text-brand-dark font-sans flex flex-col">
      <Header onNavigate={navigateTo} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
