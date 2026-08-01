import mongoose from "mongoose"

const studentWebsiteSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

nim:{
type:String,
required:true
},

website:{
type:String,
required:true
},

photo:{
type:String
}

},{timestamps:true})

export default mongoose.model("StudentWebsite",studentWebsiteSchema)