
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../utils/todos.json");

function readTodos() {
  let todos = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(todos);
}

router.route("/todos")
  .get((req, res) => {
    try {
      let todos = readTodos();
      res.json({ success: true, data: todos });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error at fetching todos : " + err.message })
    }
  })
  .post((req, res) => {
    try {
      let todos = readTodos();
      let description = req.body.description || "No description";
      let todo = { id: todos.length + 1, ...req.body, description, completed: false };
      todos.push(todo);
      fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), "utf-8", (err) => {
        if (err) {
          return res.status(404).json({ success: false, message: "Error while adding todo" });
        }
      });
      res.json({ success: true, message: "Todo added successfully", todo });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error at adding todo - " + err.message });
    }
  });



router.route("/todos/:id")
  .get((req, res) => {
    try {
      let id = parseInt(req.params.id);
      let todos = readTodos();
      let todo = todos.filter(item => item.id === id);
      if (todo.length !== 0) {
        res.json({ success: true, data: todo })
      } else {
        res.status(404).json({ success: false, message: "No Todo found with id: " + id })
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Error at fetching todo - " + err.message })
    }
  })
  .put((req, res) => {
    try {
      let id = parseInt(req.params.id);
      let todos = readTodos();
      let todo = todos.find(item => item.id === id);
      if (todo) {
        todo = { ...todo, ...req.body };
        todos = todos.map(item => {
          if (item.id === id) {
            return todo
          } else {
            return item
          }
        })
        fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), "utf-8", (err) => {
          res.status(404).json({ success: false, message: "Error while updating todo-" + id });
        })
        res.json({ success: true, message: "Todo-" + id + " updated successfully" })
      } else {
        res.status(404).json({ success: false, message: "No Todo found with id: " + id })
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "Error at updating todo - " + err.message })
    }
  })
  .delete((req, res) => {
    try {
      let id = parseInt(req.params.id);
      let todos = readTodos();
      todos = todos.filter(item => item.id !== id);
      fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), "utf-8", (err) => {
        res.status(404).json({ success: false, message: "Error while deleting todo-" + id });
      })
      res.json({ success: true, message: "Todo-" + id + " deleted successfully" })

    } catch (err) {
      res.status(500).json({ success: false, message: "Error at deleting todo - " + err.message })
    }
  })




module.exports = router;