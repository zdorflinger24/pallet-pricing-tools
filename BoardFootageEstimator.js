import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const BoardFootageEstimator = () => {
  const [formData, setFormData] = useState({
    length: '',
    width: ''
  });

  const [boardFootage, setBoardFootage] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateBoardFootage = () => {
    const lengthInFeet = formData.length / 12;
    const widthInFeet = formData.width / 12;
    return lengthInFeet * widthInFeet * 1; // Assuming 1 inch thickness
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const footage = calculateBoardFootage();
    setBoardFootage(footage);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField type="number" name="length" label="Length (in inches)" value={formData.length} onChange={handleInputChange} />
        <TextField type="number" name="width" label="Width (in inches)" value={formData.width} onChange={handleInputChange} />
        <Button type="submit">Calculate Board Footage</Button>
      </form>

      <div>
        <h2>Board Footage:</h2>
        <p>{boardFootage.toFixed(2)} board feet</p>
      </div>
    </div>
  );
};

export default BoardFootageEstimator;
