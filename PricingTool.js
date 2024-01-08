import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Button } from '@mui/material';
import axios from 'axios'

const initialFormData = {
    salesperson: '',
    companyName: '',
    palletName: '',
    length: '',
    width: '',
    lumberType: '',
    boardFeet: '',
    heatTreated: false,
    notched: false,
    painted: false,
    buildIntricacy: '',
    shippingCost: ''
    };

  const PricingTool = () => {
    const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(false);

  const [calculationResults, setCalculationResults] = useState({
    totalCost: 0,
    costPerBoardFoot: 0,
    walkawayPrice: 0,
    pricePerBoardFoot: 0,
    profitMargin20: 0,
    profitMargin25: 0,
    profitMargin30: 0
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const calculateTotalCost = () => {
    const { lumberType, boardFeet, painted, notched, heatTreated, shippingCost, buildIntricacy } = formData;
    const lumberPrices = {
      'Recycled': { a: 10, b: 60, c: 350 },
      'Combo': { a: 8, b: 96, c: 500 },
      'Green Pine': { a: 5, b: 60, c: 650 },
      'SYP': { a: 4, b: 48, c: 700 },
      'Hardwood': { a: 2, b: 0, c: 850 }
    };
  
    const { a, b, c } = lumberPrices[lumberType];
    const pricePerThousandBoardFeet = Math.abs(a * boardFeet - b) + c;
    const lumberCost = (pricePerThousandBoardFeet / 1000) * boardFeet;
  
    const additionalCosts = (painted ? 0.75 : 0) + (notched ? 0.85 : 0) + (heatTreated ? 1 : 0);
  
    const buildIntricacyCosts = {
      'Automated': 0.75,
      'Manual Easy': 1,
      'Manual Intricate': 3
    };
  
    const intricacyCost = buildIntricacyCosts[buildIntricacy] || 0;
    const totalShippingCost = parseFloat(shippingCost) || 0;
  
    const totalCost = lumberCost + additionalCosts + intricacyCost + totalShippingCost;
    const costPerBoardFoot = totalCost / boardFeet;
    const walkawayPrice = totalCost * 1.15;
    const pricePerBoardFoot = walkawayPrice / boardFeet;
    const profitMargin20 = totalCost * 1.20;
    const profitMargin25 = totalCost * 1.25;
    const profitMargin30 = totalCost * 1.30;
  
    return {
      totalCost,
      costPerBoardFoot,
      pricePerBoardFoot,
      walkawayPrice,
      profitMargin20,
      profitMargin25,
      profitMargin30
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading
    setTimeout(() => {
      const results = calculateTotalCost();
      
      // Define the webhook URL (you'll get this from Zapier)
      const webhookUrl = 'https://hooks.zapier.com/hooks/catch/17229541/3w8os6x/';
      
        // Send a POST request to the Zapier Webhook
        axios.post(webhookUrl, results)
          .then(response => {
            console.log('Data sent to Zapier:', response.data);
            // Handle success (maybe clear form or show a success message)
          })
          .catch(error => {
            console.error('There was an error!', error);
            // Handle error (show an error message)
          });

      setCalculationResults(results);
      setLoading(false);  // Stop loading
    }, 3000);  // Simulate a 3-second loading state
  };
  
  const handleReset = () => {
    setFormData(initialFormData);  // Reset form data to initial state
    setCalculationResults({
      totalCost: 0,
      costPerBoardFoot: 0,
      walkawayPrice: 0,
      pricePerBoardFoot: 0,
      profitMargin20: 0,
      profitMargin25: 0,
      profitMargin30: 0
    });  // Reset calculation results
  };
  
  return (
    <div>
       <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <InputLabel>Salesperson</InputLabel>
          <Select name="salesperson" value={formData.salesperson} onChange={handleInputChange}>
            <MenuItem value="Billy">Billy</MenuItem>
            <MenuItem value="Brendan">Brendan</MenuItem>
            <MenuItem value="Zach">Zach</MenuItem>
          </Select>
        </FormControl>
        <TextField name="companyName" label="Company Name" value={formData.companyName} onChange={handleInputChange} />
        <TextField name="palletName" label="Pallet Name" value={formData.palletName} onChange={handleInputChange} />
        <TextField type="number" name="length" label="Length (in inches)" value={formData.length} onChange={handleInputChange} />
        <TextField type="number" name="width" label="Width (in inches)" value={formData.width} onChange={handleInputChange} />
        <FormControl fullWidth>
          <InputLabel>Lumber Type</InputLabel>
          <Select name="lumberType" value={formData.lumberType} onChange={handleInputChange}>
            <MenuItem value="Recycled">Recycled</MenuItem>
            <MenuItem value="Combo">Combo</MenuItem>
            <MenuItem value="Green Pine">Green Pine</MenuItem>
            <MenuItem value="SYP">Southern Yellow Pine (SYP)</MenuItem>
            <MenuItem value="Hardwood">Hardwood</MenuItem>
          </Select>
        </FormControl>
        <TextField type="number" name="boardFeet" label="Board Feet" value={formData.boardFeet} onChange={handleInputChange} />
        <FormControlLabel control={<Checkbox checked={formData.heatTreated} onChange={handleInputChange} name="heatTreated" />} label="Heat Treated" />
        <FormControlLabel control={<Checkbox checked={formData.notched} onChange={handleInputChange} name="notched" />} label="Notched" />
        <FormControlLabel control={<Checkbox checked={formData.painted} onChange={handleInputChange} name="painted" />} label="Painted" />
        <FormControl fullWidth>
          <InputLabel>Build Intricacy</InputLabel>
          <Select name="buildIntricacy" value={formData.buildIntricacy} onChange={handleInputChange}>
            <MenuItem value="Automated">Automated</MenuItem>
            <MenuItem value="Manual Easy">Manual Easy</MenuItem>
            <MenuItem value="Manual Intricate">Manual Intricate</MenuItem>
          </Select>
        </FormControl>
        <TextField type="number" name="shippingCost" label="Shipping Cost ($)" value={formData.shippingCost} onChange={handleInputChange} />
        <Button type="submit" disabled={loading}>{loading ? 'Calculating...' : 'Calculate'}</Button>
<Button onClick={handleReset}>Reset</Button>
      </form>

      {loading && <p>Loading...</p>}
      {!loading && (
  <div>
    {/* ... display calculation results ... */}
  </div>
)}


        
      <div>
        <h2>Calculation Results:</h2>
        <p>Total Cost: ${calculationResults.totalCost.toFixed(2)}</p>
        <p>Cost per MBF: ${calculationResults.costPerBoardFoot.toFixed(5)*1000}</p>
        <p>Walkaway Price: ${calculationResults.walkawayPrice.toFixed(2)}</p>
        <p>Walkaway Price per MBF: ${calculationResults.pricePerBoardFoot.toFixed(5)*1000}</p>
        <p>20% Profit Margin Cost: ${calculationResults.profitMargin20.toFixed(2)}</p>
        <p>25% Profit Margin Cost: ${calculationResults.profitMargin25.toFixed(2)}</p>
        <p>30% Profit Margin Cost: ${calculationResults.profitMargin30.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PricingTool;
