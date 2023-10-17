const mongoose = require("mongoose");
const Schema = mongoose.Schema


const userSchema = new Schema({
    nom: {
        type: String,
        required : true
    },
    prenom: {
        type: String,
        required : true
    },
    mail:{
        type: String,
        required : true,
        unique: true
    },
    mdp: {
        type: String,
        required : true
    },
    date: {
        type: Date,
        required : true
    },
    pays: {
        type: String,
        required : true
    }
  });

  module.exports = mongoose.model("User",userSchema);