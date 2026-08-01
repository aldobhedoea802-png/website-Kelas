import mongoose from "mongoose"

const fileSchema = new mongoose.Schema({

studentId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Student",
required:true
},

filename:{
type:String
},

originalname:{
type:String
},

path:{
type:String
},

createdAt:{
type:Date,
default:Date.now
}

})

export default mongoose.model("File",fileSchema)