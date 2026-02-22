import React, { useState } from 'react';
import Layout from './components/Layout';
import Authenticate from './components/Authenticate';
import TransferOwnership from './components/TransferOwnership';
import BatchAdmin from './components/BatchAdmin';

function App() {
  const [activeTab, setActiveTab] = useState('authenticate');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="w-full h-full animate-in fade-in duration-700">
        {activeTab === 'authenticate' && <Authenticate />}
        {activeTab === 'transfer' && <TransferOwnership />}
        {activeTab === 'batch' && <BatchAdmin />}
      </div>
    </Layout>
  );
}

export default App;
