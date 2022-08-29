import API_KEY from "./apikey.js"

var form = document.getElementById("destinationForm");
var wishlist = document.getElementById("container");
var viewHeading = document.getElementById("viewHeading");

form.addEventListener("submit", addCard);

// Adds the card to container element
async function addCard(event){
    event.preventDefault();
    var destination = event.target[0].value;
    var location = event.target[1].value;
    var description = event.target[3].value;
    var newCard = await buildNewCard(destination, location, description);

    wishlist.appendChild(newCard);
    viewHeading.innerText = "My WishList";
    resetForm(event.target);
}

// Creates the card with the information from the user.
async function buildNewCard( destination, location, description){
     var col = document.createElement("div");
     col.classList.add("col");

     var card = document.createElement("div");
     card.classList.add("card", "shadow");
     card.style.width = "17rem";
     card.style.float="right";
     card.style.marginRight = "10px";

     var image = document.createElement("img");
     image.src = await getImageURL(destination, location);
     image.classList.add("card-img-top");

     var cardBody = document.createElement("div");
     cardBody.classList.add("card-body");

     var cardTitle = document.createElement("h5");
     cardTitle.innerText = destination;
     cardTitle.classList.add("card-title");
    
     var cardsubTitle = document.createElement("h6");
     cardsubTitle.innerText = location;

     var cardText = document.createElement("p");
     cardText.innerText = description;
     cardText.classList.add("card-text");

     var editButton = document.createElement("button");
     editButton.innerHTML = "Edit";
     editButton.classList.add("btn", "btn-warning");
     editButton.addEventListener("click", editCard);

     var deleteButton = document.createElement("button");
     deleteButton.innerHTML = "Delete";
     deleteButton.classList.add("btn", "btn-danger");
     deleteButton.style.float = "right";
     deleteButton.addEventListener("click", deleteCard);

     cardBody.appendChild(cardTitle);
     cardBody.appendChild(cardsubTitle);
     cardBody.appendChild(cardText);
     cardBody.appendChild(editButton);
     cardBody.appendChild(deleteButton);
     card.appendChild(image);
     card.appendChild(cardBody); 

     col.appendChild(card);
     return col;

}

// Resets the form values
function resetForm(form){
    for( var i = 0; i < form.elements.length; i++){
        form.elements[i].value = "";
    }
}
 
// Updates the values on the card
async function editCard(event){
    var newDestination = prompt("Please enter a new destination name");
    var newLocation = prompt("Please enter a new location");
    var newDesc = prompt("Please enter a new description");

    var cardBody = event.target.parentNode;
    var card = cardBody.parentNode;
    if(newDestination){
       cardBody.childNodes[0].innerText = newDestination;

    }
    if(newLocation){
        cardBody.childNodes[1].innerText = newLocation;
    }
    if(newDesc){
       cardBody.childNodes[2].innerText = newDesc;
    }
    if(newDestination || newLocation){
        var newImage = await getImageURL(newDestination, newLocation);
        card.childNodes[0].src = newImage;
    }
} 

// Deletes the card div object from the container element
function deleteCard(event){
    var card = event.target.parentNode.parentNode;
    card.remove();
}

// Gets all values by querying photos by destination and the location
async function getAllImages(searchVal, searchValTwo){
    var response =  await fetch('https://api.unsplash.com/search/photos?page=1&query=' +searchVal+','+searchValTwo +'&client_id='+ API_KEY);
    if(response.status == "200"){
        return response.json();
    }else{
        throw new Error("Invalid search value");
    }
}

// Returns a single image from all of the images
async function getImageURL(destination, location){
    var image;
    try{
        //search image URL
        var images = await getAllImages(destination, location);
        image = images.results[0].urls.thumb;
    }catch(error){
        //default image URL
        console.log(error);
        image = "./images/map.jpg";
    }
    finally{
        return image;
    }
} 