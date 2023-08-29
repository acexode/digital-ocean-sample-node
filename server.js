const createError = require("http-errors");
const express = require("express");
const path = require("path");
const fs = require('fs')
const { default: axios } = require("axios");

const baseEndpoint = "http://64.227.27.237:3000";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Serve Static Files if in Production for Heroku
if(process.env.NODE_ENV == 'production'){
  app.use(express.static('client/build'))

  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

//for Production Purpose
if(fs.existsSync(path.resolve(__dirname,'client','build','index.html'))){
  app.use(express.static('client/build'))

  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}


app.use("/api", async (req, res) => {
  console.log(req.body);

  try {
    const { method, url, body } = req.body;
    console.log(method, url, body);
    const config = {
      method: method,
      maxBodyLength: Infinity,
      url: baseEndpoint + url,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      config.data = body;
    }
    if (req.headers.authorization) {
      config.headers["Authorization"] = req.headers.authorization;
    }
    console.log(config);
    const result = await axios.request(config);
    const data = result.data.data.data
    console.log(data);
    if (result.data) {
      res.status(200).json({ data: result.data });
    } else {
      res.status(400).json({ data, message: "Operation failed" });
    }
  } catch (error) {
    // console.log(error);
    res
      .status(400)
      .json({ error: error, message: "Operation failed" });
  }
});

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server running on  port 5000"));


