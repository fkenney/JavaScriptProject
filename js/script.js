var form = document.getElementById("destinationForm");
var wishlist = document.getElementById("container");
var viewHeading = document.getElementById("viewHeading");

form.addEventListener("submit", addCard);

function addCard(event){
    var destination = event.target[0].value;
    var location = event.target[1].value;
    var photo = event.target[2].value;
    var description = event.target[3].value;
    
    if(!photo){
        photo = "./images/map.jpg";
    }

    var newCard = buildNewCard(destination, location, photo, description);
    wishlist.appendChild(newCard);
    viewHeading.innerText = "My WishList";
    event.preventDefault();
    resetForm(event.target);
}

function buildNewCard( destination, location, photo, description){
   
     var card = document.createElement("div");
     card.classList.add('card');
     card.style.width = "18rem";
     card.style.float="right";
     card.style.marginRight = "10px";

     var image = document.createElement("img");
     image.src = photo;
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
     return card;

}

function resetForm(form){
    for( var i = 0; i < form.elements.length; i++){
        form.elements[i].value = "";
    }
}

function editCard(event){
    var newDestination = prompt("Please enter a new destination name");
    var newLocation = prompt("Please enter a new location");
    var newUrl = prompt("Please enter a new photo URL");
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
    if(newUrl){
        card.childNodes[0].src = newUrl;
    }

}

function deleteCard(event){
    var card = event.target.parentNode.parentNode;
    card.remove();
}
