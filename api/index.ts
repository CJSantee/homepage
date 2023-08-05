const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const {rows: [{now: time}]} = await db.query('SELECT NOW()');
  res.send(`current database time: ${time}`);
});

export = router;
