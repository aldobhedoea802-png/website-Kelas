import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import path from "path"

import studentRoutes from "./routes/student.routes.js"
import fileRoutes from "./routes/file.routes.js"
import studentWebsiteRoutes from "./routes/studentWebsite.Routes.js"

const app = express()

/* =========================
   MIDDLEWARE
========================= */

app.use(cors())
app.use(express.json())

/* =========================
   STATIC FOLDER (UPLOAD)
========================= */

app.use("/uploads", express.static(path.join(process.cwd(),"uploads")))

/* =========================
   ROUTES
========================= */

app.use("/api/students", studentRoutes)
app.use("/api/files", fileRoutes)
app.use("/api/student-websites", studentWebsiteRoutes)

/* =========================
   DATABASE CONNECTION
========================= */

mongoose.connect("mongodb://127.0.0.1:27017/sisvor009",{
useNewUrlParser:true,
useUnifiedTopology:true
})

.then(()=>{

console.log("✅ MongoDB Connected")

app.listen(5000,()=>{

console.log("🚀 Server running at http://localhost:5000")

})

})

.catch(err=>{

console.log("❌ MongoDB Error:",err)

})