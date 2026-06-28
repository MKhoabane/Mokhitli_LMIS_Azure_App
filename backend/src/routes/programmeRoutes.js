const express = require('express');
const router = express.Router();

// Mock database for programmes
let submittedProgrammes = [
  { id: 1, saqaId: "115826", qualificationType: "Occupational Certificate", submittedAt: new Date().toISOString() },
  { id: 2, saqaId: "101234", qualificationType: "National Certificate", submittedAt: new Date().toISOString() }
];

router.post('/', (req, res) => {
  const { saqaId, qualificationType } = req.body;
  if (!saqaId || !qualificationType) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newProgramme = {
    id: submittedProgrammes.length + 1,
    saqaId,
    qualificationType,
    submittedAt: new Date().toISOString()
  };
  submittedProgrammes.push(newProgramme);
  res.status(201).json({ message: "Programme submitted successfully", data: newProgramme });
});

router.get('/', (req, res) => {
  res.json(submittedProgrammes);
});

module.exports = {
  router,
  getRecent: () => submittedProgrammes.slice(-5).reverse()
};
