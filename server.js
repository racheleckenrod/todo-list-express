// Import express library, setting the result to the express variable.
const express = require('express')

// Execute the express function, saving its result to the app variable.
const app = express()

// Import the MongoClient from the mongodb libary, setting the result to the
// MongoClient variable.
const MongoClient = require('mongodb').MongoClient

// Declare a variable named PORT with the value 2121.
const PORT = 2121

// Import the dotenv library and call its config function. This read the .env
// file and exposed the environment variable to this program.
require('dotenv').config()

// Declare a variable named db.
let db

// Declare a variable named dbConnectionStr whose value is the value from the
// DB_STRING environment variable.
let dbConnectionStr = process.env.DB_STRING

// Declare a variable named dbName with the value todo. This is the MongoDB
// database we will store todo items in.
let dbName = 'todo'

// Call the MongoClient connect method to connect to our MongoDB database. The
// useUnifiedTopology option uses the new unified topology layer.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
	// MongoClient.connect returns a promise which we'll resolve with .then.
    .then(client => {
		// Log the connected database.
        console.log(`Connected to ${dbName} Database`)

		// Tell the MongoClient to use the dbName database. Store the returned
		// Db class in the db variable.
        db = client.db(dbName)
    })

// Set the express application view engine setting to use ejs as its rendering
// engine.
app.set('view engine', 'ejs')

// Tell the express application to serve static files from the public
// directory.
app.use(express.static('public'))

// Tell the express application to automatically parse urlcoded payload.
app.use(express.urlencoded({ extended: true }))

// Tell the express application to automatically parse JSON payloads and make
// that available in the request.body.
app.use(express.json())


// Listen for HTTP GET requests on the `/` route and executes the handler.
app.get('/', async (_, response) => {
	// Find all documents within the todos collection and return them as an
	// array. Store the result in the todoItems variable. Since a promise is
	// returned, we await for the promise to resolve (or reject).
    const todoItems = await db.collection('todos').find().toArray()

	// Count the number of documents within the todos collection where the
	// completed field is false. Store the result in the itemsLeft variable.
	// Since a promise is returned, we await.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

	// Render the index.ejs file with the passed in object. Response to the
	// client with the rendered content.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
})

// Listen for HTTP POST requests on the `/addTodo` route and executes the
// handler.
app.post('/addTodo', async (request, response) => {
	// Try to execute the following code block. If a promise is rejected, the
	// catch block will be executed.
	try {
		// Insert a new document into the todos collection with the field thing
		// set to request.body.todoItem and the field completed set to false.
		await db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})

		// Log that the todo was added.
		console.log('Todo Added')

		// Redirect the client to `/`.
		response.redirect('/')

	// If any promise in the try block was rejected, execute this catch.
	} catch(err) {
		// Log the error.
		console.log(err)
	}
})

// Listen for HTTP PUT requests on the `/markComplete` route and executes the
// handler.
app.put('/markComplete', async (request, response) => {
	// Try to execute the following code block. If a promise is rejected, the
	// catch block will be executed.
	try {
		// Find a document whose thing field matches request.body.itemFromJS and
		// set its completed field to true. When finding a document, sort the
		// documents by object ID in ascending order. If no document was found, do
		// not insert a new one.
		await db.collection('todos').updateOne({thing: request.body.itemFromJS},{
			// If a document was found, set it's completed field to true.
			$set: {
				completed: true
			}
		},{
			// When finding a document, sort the documents by object ID in
			// ascending order.
			sort: {_id: -1},
			// If we don't find a document to update, do not create one.
			upsert: false
		})

		// Log that the update was complete.
        console.log('Marked Complete')

		// Response to the client, letting them know the update was complete.
        response.json('Marked Complete')

	// If any promise in the try block was rejected, execute this catch.
	} catch(err) {
		// Log the error.
		console.log(err)
	}
})

// Listen for HTTP PUT requests on the `/markUnComplete` route and executes the
// handler.
app.put('/markUnComplete', async (request, response) => {
	// Try to execute the following code block. If a promise is rejected, the
	// catch block will be executed.
	try {
		// Find a document whose thing field matches request.body.itemFromJS and
		// set its completed field to true. When finding a document, sort the
		// documents by object ID in ascending order. If no document was found, do
		// not insert a new one.
		await db.collection('todos').updateOne({thing: request.body.itemFromJS},{
			// If a document was found, set it's completed field to false.
			$set: {
				completed: false
			}
		},{
			// When finding a document, sort the documents by object ID in
			// ascending order.
			sort: {_id: -1},
			// If we don't find a document to update, do not create one.
			upsert: false
		})

		// Log that the update was complete.
        console.log('Marked UnComplete')

		// Response to the client, letting them know the update was complete.
        response.json('Marked UnComplete')

	// If any promise in the try block was rejected, execute this catch.
	} catch(err) {
		// Log the error.
		console.log(err)
	}
})

// Listen for HTTP DELETE requests on the `/deleteItem` route and executes the
// handler.
app.delete('/deleteItem', async (request, response) => {
	// Try to execute the following code block. If a promise is rejected, the
	// catch block will be executed.
	try {
		// Delete a document in the todos collection whose thing field matches
		// request.body.itemFromJS.
		await db.collection('todos').deleteOne({thing: request.body.itemFromJS})

		// Log that the delete was completed.
		console.log('Todo Deleted')

		// Response to the client, letting them know the delete was complete.
        response.json('Todo Deleted')

	// If any promise in the try block was rejected, execute this catch.
	} catch(err) {
		// Log the error.
		console.log(err)
	}
})

// Start the express web server, listening on port PORT. PORT is retrieved from
// the PORT environment variable or the PORT variable if not found.
app.listen(process.env.PORT || PORT, ()=>{
	// Log which port the web server is running on.
    console.log(`Server running on port ${PORT}`)
})