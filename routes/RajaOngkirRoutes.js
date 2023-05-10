const express = require('express');
const router = express.Router();
const axios = require("axios").default;
require("dotenv").config();

axios.defaults.baseURL = 'https://api.rajaongkir.com/starter'
axios.defaults.headers.common['key'] = process.env.RAJAONGKIR_KEY
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

router.get('/province/:id?', (req, res) => {
  const id = req.params.id;
  if (!id){
    axios.get(`/province`)
    .then(response => res.formatter.ok(response.data))
    .catch(err => res.formatter.ok(err))
  }
  else{
    axios.get(`/province?id=${id}`)
      .then(response => res.formatter.ok(response.data))
      .catch(err => res.formatter.ok(err))
  }
})

router.get('/city/:provId?', (req, res) => {
  const id = req.params.provId;
  if (!id){
    axios.get(`/city`)
      .then(response => res.formatter.ok(response.data))
      .catch(err => res.formatter.ok(err))
  }
  else{
    axios.get(`/city?province=${id}`)
      .then(response => res.formatter.ok(response.data))
      .catch(err => res.formatter.ok(err))
  }
})

module.exports = router;