const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlast";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
  await Listing.deleteMany({});
  const updateData=initData.data.map((obj)=>({...obj,owner:'67fdec0b19ca6f87511df7a5'}
    
  ));
  
  await Listing.insertMany(updateData);
  console.log("data was initialized");
};

initDB();