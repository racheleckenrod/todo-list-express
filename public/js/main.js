// Query the HTML document (is ejs, so we have NodeLists) for all elements with the class '.fa-trash' and store the result in the variable deleteBtn.
const deleteBtn = document.querySelectorAll('.fa-trash')
// Query the HTML document for all elements with the class ".item span" and store the result in the variable item.
const item = document.querySelectorAll('.item span')
// Query the HTML document for all elements with the class ".item span.completed" and store the variable itemCompleted.
const itemCompleted = document.querySelectorAll('.item span.completed')

// Create an array from the deleteBtn NodeList and iterate over all the elements.
Array.from(deleteBtn).forEach((element)=>{
    // Add an event Listener to each element that fires the deleteItem function on a "click" event.
    element.addEventListener('click', deleteItem)
})

// Create an array from the item NodeList and iterate over each of the elements.
Array.from(item).forEach((element)=>{
    // Add an event Listener to each element that fires the markComplete function on a "click" event.
    element.addEventListener('click', markComplete)
})

// Create an array from the item NodeList and iterate over each of the elements.
Array.from(itemCompleted).forEach((element)=>{
    // Add an event Listener to each element that fires the markUncomplete function on a "click" event.
    element.addEventListener('click', markUnComplete)
})

// Declare an async function named deleteIem that takes no arguments, and does not return anything. It is async because it contains awaits.
async function deleteItem(){
    // the variable itemText stores the text from the innerText of the first child node of the parent node that was clicked in the DOM from the event listener that was placed there.
    const itemText = this.parentNode.childNodes[1].innerText

    // Try to execute the folowing code block. If a promise is rejected, the catch block will be executed.
    try{
        // Send an HTTP request to the 'deleteItem' route and store the response in the variable response
        const response = await fetch('deleteItem', {
            // the HTTP request is a DELETE request.
            method: 'delete',
            // Add a Content-Type request header with the value 'application/json' to the DELETE request.
            headers: {'Content-Type': 'application/json'},
            // Convert the object to JSON and send it in the request body.I think this is where the 'itemFromJS' is created and named and defined as containing the information in the variable itemText from above(this.parentNode.childNodes[1].innerText)
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //   Resolve the response promise from server and store the data recieved in a variable data formatted as JSON
        const data = await response.json()
        // Log the data in the console
        console.log(data)
        // Reload the current page
        location.reload()

        //   if and promise in the try code block was rejected, execute the code in the catch block
    }catch(err){
        // send the error to the console
        console.log(err)
    }
}

// Declare the markComplete function. It takes no arguments and does not return anything. it is async because it contains awaits.
async function markComplete(){
    // create a variable itemText that contains the innerText from the click event that triggered the function call. it will have the value of the childNodes[1] of the parentNode where the click event occurred.
    const itemText = this.parentNode.childNodes[1].innerText

    // Try to execute the following code block. If an error occurrs, or promise is rejected , execute the catch block of code.
    try{
        // Send an HTTP request with the route 'markComplete'
        const response = await fetch('markComplete', {
            // The HTTP request will be a PUT request
            method: 'put',
            // Add a Content-Type request header with the value of application/json.
            headers: {'Content-Type': 'application/json'},
            // send the variable itemText in JSON with the key value of itemFromJS in the body of the request.
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //   Store the response from the server in the variable data as JSON.
        const data = await response.json()
        // send the data to the console and log it.
        console.log(data)
        // Reload the current page
        location.reload()
        //   If any promise fails to resolve, run the catch code block.
    }catch(err){
        // send the error to the console and log it.
        console.log(err)
    }
}

// Declare a markUncomplete function that takes no arguments and returns nothing. It is an async function because it contains awaits.
async function markUnComplete(){
    // Retrieve the text from the DOM- the innerText from the click event that called the function. the childNodes[1] of the parentNode,  and storeit in the variable itemText.
    const itemText = this.parentNode.childNodes[1].innerText
    // Try to execute the following code, If a promise is rejected, the catch block will be executed.
    try{
        // Send an HTTP request on the 'markUnComplete' route.
        const response = await fetch('markUnComplete', {
            // the HTTP request is a PUT request.
            method: 'put',
            // Send a Content-Type header with the value application/json in the request.
            headers: {'Content-Type': 'application/json'},
            // In the body, send an object converted to JSON with the variable itemText and the key of itemFromJS.
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //   Resolve the response promise from the server and fetch its content as JSON. Store it in the variable data.
        const data = await response.json()
        // Log that data in the console.
        console.log(data)
        // Reload the current page.
        location.reload()

        // If any promise is rejected, run the catch block of code
    }catch(err){
        // log the error in the console.
        console.log(err)
    }
}