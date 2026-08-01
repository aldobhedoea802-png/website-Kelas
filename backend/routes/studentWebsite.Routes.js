import express from "express"
import multer from "multer"
import fs from "fs"
import path from "path"
import StudentWebsite from "../models/studentWebsite.js"

const router = express.Router()

/* =========================
   CREATE UPLOAD FOLDER
========================= */

const uploadPath = "uploads/websites"

if (!fs.existsSync(uploadPath)) {
fs.mkdirSync(uploadPath, { recursive: true })
}


/* =========================
   MULTER STORAGE
========================= */

const storage = multer.diskStorage({

destination: (req, file, cb) => {
cb(null, uploadPath)
},

filename: (req, file, cb) => {
const uniqueName = Date.now() + "-" + file.originalname
cb(null, uniqueName)
}

})

const upload = multer({ storage })


/* =========================
   GET ALL WEBSITE
========================= */

router.get("/", async (req, res) => {

try {

const data = await StudentWebsite.find().sort({ createdAt: -1 })

res.json(data)

} catch (error) {

res.status(500).json({ message: error.message })

}

})


/* =========================
   POST WEBSITE MAHASISWA
========================= */

router.post("/", upload.single("photo"), async (req, res) => {

try {

const data = new StudentWebsite({

name: req.body.name,
nim: req.body.nim,
website: req.body.website,

// simpan path lengkap
photo: req.file ? `uploads/websites/${req.file.filename}` : ""

})

await data.save()

res.json(data)

} catch (error) {

res.status(500).json({ message: error.message })

}

})


/* =========================
   DELETE WEBSITE
========================= */

router.delete("/:id", async (req, res) => {

try {

const website = await StudentWebsite.findById(req.params.id)

if (!website) {
return res.status(404).json({ message: "Data tidak ditemukan" })
}

// hapus file foto dari server
if (website.photo && fs.existsSync(website.photo)) {
fs.unlinkSync(website.photo)
}

await StudentWebsite.findByIdAndDelete(req.params.id)

res.json({ message: "Website berhasil dihapus" })

} catch (error) {

res.status(500).json({ message: error.message })

}

})

export default router