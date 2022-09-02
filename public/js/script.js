const form = document.querySelector('#destinationForm');
 
 // edits wishlist item by ID
 function edit(itemId){;
    let data = {};
    let newDestination = prompt("Please enter a new destination name");
    let newLocation = prompt("Please enter a new location");
    let newDesc = prompt("Please enter a new description");

    data.id = itemId;
    if(newDestination){
        data.destination = newDestination;
    }
    if(newLocation){
        data.location = newLocation;
    }
    if(newDesc){
        data.description = newDesc;
    }
    // If nothing wasns't updated don't 
    if(!data.destination && !data.location && !data.newDesc){
        return false;
    }

    fetch('/vacations',{
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(response => {
        window.location.reload(true)
    })
    .catch(err => console.error(err))
 }


// Deletes wishlist item by ID
function deleteCard(itemId){
    let data = { id : itemId};

    fetch('/vacations',{
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: itemId
        })
    })
    .then(response => {
        if (response === 'No item to delete') {
            console.log("nothing to delete")
        } else {
            window.location.reload(true)
        }
    })
    .catch(err => console.error(err))
}





