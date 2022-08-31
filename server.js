// Import the express Library and set the result to the variable express.
const express = require('express')
// execute the express function and set the result to the variable app.
const app = express()
// Import MongoClient from the mongodb Library and store the result in the variable MongoClient.
const MongoClient = require('mongodb').MongoClient
// Declare a variable named PORT with a value of 2120
const PORT = 2120
// Import the dotenv library and call its config function. This allows the .env file to be read and the environment variable to be used in this program.
require('dotenv').config()

// Declare variables.
let db,
//  dbConnectionStr is set equal to the password containing srting from Mongodb that is stored in the .env file. 
    dbConnectionStr = process.env.DB_STRING,
    // Declare a variable named dbName with the value todo. This is the name of the database on MongoDB.
    dbName = 'todo'

    // Call the MongoClient connect method to connect to our MongoDB database. The useUnifiedTopology option uses the new unified topology layer.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    // MongoClient.connect returns a promise that we will resolve with .then
    .then(client => {
        // Send the string to the console that includes the name of the Database
        console.log(`Connected to ${dbName} Database`)
        // tell the MongoClient to use the dbName database. Store the returned db class in the db variable. Contains several objects.
        db = client.db(dbName)
    })
    
// Set the express application view engine setting to use ejs as its rendering engine.
app.set('view engine', 'ejs')
// Tell the express application to serve static files from the public directory (folder)
app.use(express.static('public'))
// tell the express application to automatically parse urlcoded payload. Is build in middleware. This is why we add Content-Type header to our requests.
app.use(express.urlencoded({ extended: true }))
// Tell the express application to automatically parse JSON payloads and make that available in the request.body.
app.use(express.json())


// Listen for HTTP GET requests on the '/' route and executes the handler.
app.get('/',async (request, response)=>{
    // WE have two options for the same functionality. to use await or  .then and .catch

    // Find all documents within the todos collection and return them as an array. Store the results in the todoItems variable. Since a promise is returned, we await for the promise to resolve (or reject).
    const todoItems = await db.collection('todos').find().toArray()

    // Count the number of documents within the todos caoolection where the completed field is false. Store the result in the itemsLeft variable. Since a promise is returned, we await.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})

    // Render the index.ejs file with the passed in object. Response to the client with the rendered content.
    response.render('index.ejs', { items: todoItems, left: itemsLeft })


    // Find all the documents in the todos collection and return them as an array.
    // db.collection('todos').find().toArray()

    // 
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', async (request, response) => {
    // Try to execute the following code block. If a promise is rejected, the catch block will run instead.
    try {
        // Insert a new document into the todos collection with the field thing set to request.body.todoItem and the field completed set to false.
        await db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})

        // Log that the todo was added.
        console.log('Todo added')

        // redirect the client to '/'.
        response.redirect('/')

        // If any promise in the try block was rejected, execute this catch.
    } catch(err) {
        // log the error.
        console.log(err)
    }

    // db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // .then(result => {
    //     console.log('Todo Added')
    //     response.redirect('/')
    // })
    // .catch(error => console.error(error))
})

// Listen for HTTP PUT requests on the '/markComplete' route and executes the handler.
app.put('/markComplete', async (request, response) => {
    // Try to execute the following code block. If a promise is rejected, the catch block will be executed.
    try{
        // Find a document whose thing field matches request.body.itemFromJS and set its completed field to true. When finding a document, sort the documents by object ID in ascending order. If no document is found, do not insert a new one.
        await db.collection('todos').updateOne({thing: request.body.itemFromJS}, {
            // If a document was found, set it's completed field to true.
            $set: {
                completed: true
            }
        },{
            // When finding a document, sort the documents by object ID in ascending order.
            sort: {_id: -1},
            // If no document is found, do not create one.
            upsert: false
        })

        // log that the update is complete.
        console.log('Marked Complete')

        // Response to the client, letting them know the update is complete.
        response.json('Marked Complete')

        // If any promise in the try block was rejected, execute this catch.
    } catch(err){
        // Log the error.
        console.log(err)
    }

    // ALTERNATIVE CODE EXAMPLE, USE WITHOUT ASYNC
    // db.collection('todos').updateOne({thing: request.body.itemFromJS},{
    //     $set: {
    //         completed: true
    //       }
    // },{
    //     sort: {_id: -1},
    //     upsert: false
    // })
    // .then(result => {
    //     console.log('Marked Complete')
    //     response.json('Marked Complete')
    // })
    // .catch(error => console.error(error))

})

// Listen for HTTP PUT requests on the '/markUnComplete' route and execute the handler
app.put('/markUnComplete', async (request, response) => {
    // Try to execute the following code block. If a promise is rejected, the catch block will be executed.
    try{
        // Find a document whose thing field matches request.body.itemFromJS and set its completed field to true. When finding a document, sort the documents by object ID in ascending order. If no document is found, do not insert a new one.
        await db.collection('todos').updateOne({thing: request.body.itemFromJS},{
            // If a document was found, set it's completed field to false.
            $set: {
                completed: false
            }
        },{
            // When finding a document, sort the document by object ID in ascending order.
            sort: {_id: -1},
            // If we don't find a document to update, do not create one.
            upsert: false
        })

        // Log that the update was complete.
        console.log('Marked UnComplete')

        // Response to the client, letting them know the update was complete.
        response.json('Marked UnComplete')

        // If any promise in the try block was rejected, execute this catch.
    }catch(err){
        // Log the error.
        console.log(err)
    }

    // db.collection('todos').updateOne({thing: request.body.itemFromJS},{
    //     $set: {
    //         completed: false
    //       }
    // },{
    //     sort: {_id: -1},
    //     upsert: false
    // })
    // .then(result => {
    //     console.log('Marked Complete')
    //     response.json('Marked Complete')
    // })
    // .catch(error => console.error(error))

})

// Listen for HTTP DELETE request on the '/deleteItem' route and executes the handler.
app.delete('/deleteItem', async (request, response) => {
    // Try to execute the following code block. If a promise is rejected, the catch block will be executed.
    try{
        // Delete a document in the todos collection whose thing field matches request.body.itemFromJS.
        await db.collection('todos').deleteOne({thing: request.body.itemFromJS})

        // Log that the delete was completed.
        console.log('Todo Deleted')

        // Response to the client, letting them know the delete was complete.
        response.json('Todo Deleted')

        // If any promise in the try block was rejected, execute this catch.
    }catch(err){
        // Log the error
        console.log(err)
    }
    // db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    // .then(result => {
    //     console.log('Todo Deleted')
    //     response.json('Todo Deleted')
    // })
    // .catch(error => console.error(error))

})

// Start the express web server, listening on por PORT. PORT is retrieved from the PORT environmnet variable or the PORT variable if not found.
app.listen(process.env.PORT || PORT, ()=>{
    // log which port the web server is running on.
    console.log(`Server running on port ${PORT}`)
})