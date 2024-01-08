import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';

const TransportationCostEstimator = () => {
  const [formData, setFormData] = useState({
    vehicleType: '',
    distance: '',
    length: '',
    width: ''
  });

  const [costEstimate, setCostEstimate] = useState(0);

  const [loadingConfigurations, setLoadingConfigurations] = useState({
    loadedLong: 0,
    loadedWide: 0,
    pinwheeled: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculatePallets = (vehicleLength, vehicleWidth, palletLength, palletWidth) => {
    const loadedLong = Math.floor(vehicleLength / palletLength) * Math.floor(vehicleWidth / palletWidth) * 22;
    const loadedWide = Math.floor(vehicleLength / palletWidth) * Math.floor(vehicleWidth / palletLength) * 22;
    const pinwheeled = Math.floor(vehicleLength / (palletWidth + palletLength)) * 2 * Math.floor(vehicleWidth / (palletWidth + palletLength)) * 2 * 22;

    return { loadedLong, loadedWide, pinwheeled };
  };


  const calculateTransportationCost = () => {
    const baseDeliveryFee = {
      'Truck': 100,
      'Dry Van': 200,
      'Flatbed': 250
    };
  
    const perMileCharge = 2;
    const deliveryFee = baseDeliveryFee[formData.vehicleType] || 0;
    const totalCost = deliveryFee + (formData.distance * perMileCharge);

  
    return totalCost;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const cost = calculateTransportationCost();
    setCostEstimate(cost);
    const { vehicleType, length, width } = formData;
    const palletLength = parseFloat(length);
    const palletWidth = parseFloat(width);

    const vehicleDimensions = {
      'Truck': { length: 408, width: 96 },
      'Dry Van': { length: 636, width: 102 },
      'Flatbed': { length: 636, width: 102 }
    };

    const { length: vehicleLength, width: vehicleWidth } = vehicleDimensions[vehicleType];
    const configurations = calculatePallets(vehicleLength, vehicleWidth, palletLength, palletWidth);
    setLoadingConfigurations(configurations);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <InputLabel>Vehicle Type</InputLabel>
          <Select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange}>
            <MenuItem value="Truck">Truck</MenuItem>
            <MenuItem value="Dry Van">Dry Van</MenuItem>
            <MenuItem value="Flatbed">Flatbed</MenuItem>
          </Select>
        </FormControl>
        <TextField type="number" name="distance" label="Distance (miles)" value={formData.distance} onChange={handleInputChange} />
        <TextField type="number" name="length" label="Pallet Length (inches)" value={formData.length} onChange={handleInputChange} />
        <TextField type="number" name="width" label="Pallet Width (inches)" value={formData.width} onChange={handleInputChange} />
        <Button type="submit">Calculate Cost</Button>
        <Button type="submit">Calculate Pallets</Button>
      </form>

      <div>
        <h2>Cost Estimate:</h2>
        <p>${costEstimate.toFixed(2)}</p>
        <h2>Pallet Loading Configurations:</h2>
        <p>Loaded Long: {loadingConfigurations.loadedLong}</p>
        <p>Loaded Wide: {loadingConfigurations.loadedWide}</p>
        <p>Pinwheeled: {loadingConfigurations.pinwheeled}</p>

        <h2>Cost Estimate per Pallet:</h2>
        <p>${costEstimate.toFixed(0)/loadingConfigurations.loadedLong.toFixed(0)}</p>
      </div>
    </div>
  );
};

export default TransportationCostEstimator;
