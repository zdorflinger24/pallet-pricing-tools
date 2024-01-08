import React, { useState } from 'react';
import './App.css';  // Importing App.css
import { Tabs, Tab, Box } from '@mui/material';
import PricingTool from './PricingTool';
import TransportationCostEstimator from './TransportationCostEstimator';
import BoardFootageEstimator from './BoardFootageEstimator';


function App() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };


return (
  <div className="appContainer">
    
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="tabs">
          <Tab label="Pricing Tool" />
          <Tab label="Transportation Cost Estimator" />
          <Tab label="Board Footage Estimator" />
      </Tabs>
    </Box>
    {selectedTab === 0 && <PricingTool />}
    {selectedTab === 1 && <TransportationCostEstimator />}
    {selectedTab === 2 && <BoardFootageEstimator />}
  </div>
);
}

export default App;