import express from "express"
import multer from "multer"
import Student from "../models/student.js"

const router = express.Router()

// storage foto mahasiswa
const storage = multer.diskStorage({

destination:(req,file,cb)=>{
cb(null,"uploads/students")
},

filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}

})

const upload = multer({storage})


// CREATE STUDENT
router.post("/", upload.single("photo"), async(req,res)=>{

try{

const student = new Student({

name:req.body.name,
nim:req.body.nim,
kelas:req.body.kelas,
photo:req.file ? "uploads/students/"+req.file.filename : ""

})

await student.save()

res.json(student)

}catch(err){

res.status(500).json({message:err.message})

}

})


// GET ALL STUDENTS
router.get("/", async(req,res)=>{

try{

const students = await Student.find()

res.json(students)

}catch(err){

res.status(500).json({message:err.message})

}

})


// GET STUDENT BY ID
router.get("/:id", async(req,res)=>{

try{

const student = await Student.findById(req.params.id)

res.json(student)

}catch(err){

res.status(500).json({message:err.message})

}

})


// DELETE STUDENT
router.delete("/:id", async(req,res)=>{

try{

await Student.findByIdAndDelete(req.params.id)

res.json({message:"Student deleted"})

}catch(err){

res.status(500).json({message:err.message})

}

})

export default router