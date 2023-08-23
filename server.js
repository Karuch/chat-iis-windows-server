const express = require('express')
const app = express()
const cors = require("cors");
const pool = require("./db");

// current timestamp in milliseconds
let ts = Date.now();
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
// prints date & time in YYYY-MM-DD format
let current_date = year + "-" + month + "-" + date;

app.use(cors());

app.post('/db_send', async (req, res) => {
  try {
    const queryParams = req.query;
    const sender = queryParams.sender || 'Unknown';
    const receiver = queryParams.receiver || 'Unknown';
    const message = queryParams.message || 'none'
    const full_message = `${message} [${current_date} from ${sender}]`
    const get_max_id = await pool.query("SELECT MAX(_Id) FROM Messages_table");
    const push = await pool.query(`INSERT INTO Messages_table (_Id, _Name, _Unreaded, _Message) 
                                   VALUES (${get_max_id.rows[0].max + 1}, '${receiver}', '${full_message}', '${full_message}')`);  
    res.status(200).send("success!");
  } catch (err) {
    res.status(400).send(err.message); 
    console.error(err.message);
  }
});

app.delete('/db_delete/:id', async (req, res) => {
  try {
    const db = await pool.query("SELECT * FROM Messages_table");
    const db_delete = await pool.query(`DELETE FROM Messages_table WHERE _id=${req.params.id}`);
    res.status(200).send("success!");
  } catch (err) {
    res.status(400).send(err.message);
    console.error(err.message);
  }
});

app.get('/db_msg/:id', async (req, res) => {
  try {
    const db = await pool.query(`SELECT _message FROM Messages_table WHERE _name='${req.params.id}'`);
    const db_remove_unreaded = await pool.query(`UPDATE Messages_table SET _unreaded = NULL WHERE _id IN 
                                                (SELECT _id FROM Messages_table WHERE _name = '${req.params.id}')`);
    res.status(200).send(db.rows);
  } catch (err) {
    res.status(400).send(err.message);
    console.error(err.message);
  }
});

app.get('/db_new/:id', async (req, res) => {
  try {
    const db = await pool.query(`SELECT _unreaded FROM Messages_table WHERE _name='${req.params.id}'`);
    const db_remove_unreaded = await pool.query(`UPDATE Messages_table SET _unreaded = NULL WHERE _id IN 
                                                (SELECT _id FROM Messages_table WHERE _name = '${req.params.id}')`);
    res.status(200).send(db.rows);
  } catch (err) {
    res.status(400).send(err.message);
    console.error(err.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})