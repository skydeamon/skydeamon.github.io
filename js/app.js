
/* ---------------- Tab Menu -------------------------- */
var tablinks = document.querySelectorAll(".tablinks");
var tabcontent = document.querySelectorAll(".tabcontent");
var circles = document.querySelector(".circles")

displayContentNone();
document.getElementById("Home").style.display = "block";

tablinks.forEach(function(btn){
    btn.addEventListener("click",function(e){
        stopDefault(e);
        displayContentNone();
        deactivateLink();
        const section = e.currentTarget.dataset.id;
        showTab(e,section);
        placeCircle(section);

    });
});

function placeCircle(sect){
    if (sect === "Home"){
        circles.style.float = "none";
    }
    else{
        circles.style.float = "right";
    }
}

function stopDefault(e){
    e.preventDefault();
}

function displayContentNone(){
    // Get all elements with class="tabcontent" and hide them
    for(let i = 0; i < tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }
}

function deactivateLink(){
    // Get all elements with class="tablinks" and remove the class "active"
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}

function showTab(evt, sectName){
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(sectName).style.display = "block";
    evt.currentTarget.className += " active";
}

/* ------------------------------- Home sliders -------------------------- */

const science = 17;
const space = 12;
const tech = 14;

var slides = document.querySelectorAll(".column");

setInterval(slideShow, 3000);

function slideShow(){
    let category,number;
    slides.forEach(function(slide){
        if (slide.id === "slide-1"){
            category = "sp";
            number = space;
        }
        else if (slide.id === "slide-2") {
            category = "tech";
            number = tech;
        }
        else if (slide.id === "slide-3") {
            category = "sc";
            number = science;
        }
        slide.innerHTML = changeImage(category,number);
    });
}


function changeImage(category, number){
    let rndNumber = Math.random();
    return `<img scr="../images/${category}${Math.floor(rndNumber*space)}.jpg" alt="${category}${Math.floor(rndNumber*space)}.jpg" loading='lazy' width='214'>`;
}