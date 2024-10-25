const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const todosRouter = require("./routes/todoRouter")


const app = express()

app.use(cors())

app.use( bodyParser.json() )
app.use( express.urlencoded({extended: true}))

app.use("/api/v1/" , todosRouter );

app.get("/", (req, res)=>{
  res.send("Hello Welcome to the Todo App, explore the API at /api/v1/todos");
})

app.listen( 3000 , ()=>{
  console.log("Server is running at port 3000");
} )

