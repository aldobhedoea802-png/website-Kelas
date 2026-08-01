import Student from "../models/Student.js"

export const getStudents = async (req, res) => {
  const students = await Student.find()
  res.json(students)
}

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)

    if (!student) {
      return res.status(404).json({ message: "Student tidak ditemukan" })
    }

    res.json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createStudent = async (req, res) => {
  const student = new Student(req.body)
  await student.save()
  res.json(student)
}
