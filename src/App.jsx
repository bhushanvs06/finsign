import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate,Link } from 'react-router-dom';
import Dash from './Components/dash';
import AnalysisResultPage from './Components/result';


function App() {
  return (
  
    <Router>
      <Routes>
        <Route path="/" element={<Dash />} />
        <Route path="/results" element={<AnalysisResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
