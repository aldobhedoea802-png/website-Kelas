import File from "../models/File.js"

export const getFilesByStudent = async (req,res)=>{

try{

const files = await File.find({studentId:req.params.id})

res.json(files)

}catch(err){

res.status(500).json({message:err.message})

}

}


export const uploadFile = async (req,res)=>{

try{

if(!req.file){

return res.status(400).json({
message:"File tidak ditemukan"
})

}

const file = new File({

studentId:req.body.studentId,
filename:req.file.filename,
originalname:req.file.originalname

})

await file.save()

res.json(file)

}catch(err){

res.status(500).json({message:err.message})

}

}
