import express from "express"
import multer from "multer"
import File from "../models/file.js"
import fs from "fs"

const router = express.Router()

// storage upload project
const storage = multer.diskStorage({

destination:(req,file,cb)=>{
cb(null,"uploads/files")
},

filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}

})

const upload = multer({storage})


// ============================
// UPLOAD FILE PROJECT
// ============================
router.post("/", upload.single("file"), async(req,res)=>{

try{

const file = new File({

studentId:req.body.studentId,
filename:req.file.filename,
originalname:req.file.originalname,
path:"uploads/files/"+req.file.filename

})

await file.save()

res.json(file)

}catch(err){

res.status(500).json({message:err.message})

}

})


// ============================
// GET FILES BY STUDENT
// ============================
router.get("/student/:id", async(req,res)=>{

try{

const files = await File.find({
studentId:req.params.id
})

res.json(files)

}catch(err){

res.status(500).json({message:err.message})

}

})


// ============================
// GET ALL FILES
// ============================
router.get("/", async(req,res)=>{

try{

const files = await File.find().populate("studentId")

res.json(files)

}catch(err){

res.status(500).json({message:err.message})

}

})


// ============================
// DELETE FILE
// ============================
router.delete("/:id", async(req,res)=>{

try{

const file = await File.findById(req.params.id)

if(!file){

return res.status(404).json({
message:"File tidak ditemukan"
})

}

// hapus file dari folder
const filePath = `uploads/files/${file.filename}`

if(fs.existsSync(filePath)){
fs.unlinkSync(filePath)
}

// hapus dari database
await File.findByIdAndDelete(req.params.id)

res.json({
message:"File berhasil dihapus"
})

}catch(err){

res.status(500).json({
message:err.message
})

}

})

export default router