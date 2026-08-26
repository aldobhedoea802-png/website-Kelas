import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

nim:{
type:String,
required:true
},

kelas:{
type:String,
required:true
},

photo:{
type:String
}

},{timestamps:true})

export default mongoose.model("Student",studentSchema)