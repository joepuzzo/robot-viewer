import express from 'express';

const router = express.Router();

router.get('/camera', (req, res) => {
  const data = [
    { id: '7', type: 'Cup', confidence: 50, x: 30, y: 30, z: 30 },
    { id: '8', type: 'Cup', confidence: 50, x: -30, y: -30, z: 30 },
  ];

  // Random data
  const updatedData = data.map((item) => {
    return {
      ...item,
      x: Math.random() * 100 - 50, // generates random number between -60 and 60
      y: Math.random() * 100 - 50, // generates random number between -60 and 60
      z: 10,
    };
  });
  return res.send(updatedData);
});

export default router;
