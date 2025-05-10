import React from 'react';
import FileUpload from '../components/FileUpload';
import { clearAllData } from '../storage/db';

const Home = () => {
  const handleResetAll = async () => {
    const confirm = window.confirm("Are you sure you want to reset all saved data?");
    if (confirm) {
      await clearAllData();
      alert("All data has been cleared. You can start fresh.");
      window.location.reload();
    }
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4">Upload Amazon Box Content File</h3>
      
      <div className="mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <FileUpload />
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-outline-danger" onClick={handleResetAll}>
          🗑️ Reset All Data
        </button>
      </div>
    </div>
  );
};

export default Home;
