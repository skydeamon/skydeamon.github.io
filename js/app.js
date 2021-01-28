var tablinks = document.querySelectorAll(".tablinks");
var tabcontent = document.querySelectorAll(".tabcontent");

displayContentNone();
document.getElementById("Home").style.display = "block";

tablinks.forEach(function(btn){
    btn.addEventListener("click",function(e){
        stopDefault(e);
        displayContentNone();
        deactivateLink();
        const section = e.currentTarget.dataset.id;
        console.log(section);
        showTab(e,section);

    });
});

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