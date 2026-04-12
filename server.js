require("dotenv").config()

const app = require("./src/app.js")
const { connectDB } = require("./src/config/db.js")


const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error.message)
    // Don't exit on Vercel - just log and let functions handle requests
    if (process.env.NODE_ENV !== "production") {
      process.exit(1)
    }
  }
}

startServer()