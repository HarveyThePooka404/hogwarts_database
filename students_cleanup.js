"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

const student = {
    id: "",
    firstName: "",
    middleName: null,
    lastName: null,
    gender: "",
    house: "",
    image: "",
    blood: "",
    prefect: false,
    inquisition: false,
};

function start() {
    loadJSON();
}


function loadJSON() {

    fetch("https://petlatkea.dk/2020/hogwarts/students.json")
        .then(response => response.json())
        .then(jsonData => {
            // when loaded, prepare objects
            prepareObjects(jsonData);
            loadBlood();
        });
}

function loadBlood() {
    fetch("https://petlatkea.dk/2020/hogwarts/families.json")
        .then(e => e.json())
        .then(family => {
            // when loaded, prepare objects
            prepareBlood(family);
        });
}

function prepareObjects(jsonData) {

    jsonData.forEach(jsonObject => {

        let students = Object.create(student);
        let newName = jsonObject.fullname.split(" ");

        if (newName.length > 2) {
            if (jsonObject.fullname[0] == " ") {
                students.firstName = newName[1];
                students.lastName = newName[2];
            }

            else if (jsonObject.fullname[jsonObject.fullname.length - 1] == " ") {
                students.firstName = newName[0];
                students.lastName = newName[1]
            }

            else {
                let regex = /^[A-Za-z0-9 ]+$/
                let condition = regex.test(jsonObject.fullname);
                if (condition == false) {

                    students.firstName = newName[0].replace(/[^a-zA-Z0-9]/g, '');
                    students.middleName = newName[1].replace(/[^a-zA-Z0-9]/g, '');
                    students.lastName = newName[2].replace(/[^a-zA-Z0-9]/g, '');

                } else {
                    students.firstName = newName[0];
                    students.middleName = newName[1]
                    students.lastName = newName[2];
                }
            }
        }

        else {
            students.firstName = newName[0];
            students.lastName = newName[1]
        }

        let house = jsonObject.house.trim();
        students.house = house[0].toUpperCase() + house.substring(1).toLowerCase();


        allStudents.push(students);
    });

    for (let i = 0; i < allStudents.length; i++) {


        let restOftheFirst = allStudents[i].firstName.substring(1).toLowerCase();
        allStudents[i].firstName = allStudents[i].firstName.charAt(0).toUpperCase() + restOftheFirst;

        if (allStudents[i].middleName != null) {
            let restOftheMiddle = allStudents[i].middleName.substring(1).toLowerCase();
            allStudents[i].middleName = allStudents[i].middleName.charAt(0).toUpperCase() + restOftheMiddle;
        }

        if (allStudents[i].lastName == null) {
            allStudents[i].lastName = " ";

        }

        if (allStudents[i].lastName != null) {
            let restOftheLast = allStudents[i].lastName.substring(1).toLowerCase();
            allStudents[i].lastName = allStudents[i].lastName.charAt(0).toUpperCase() + restOftheLast;
        }

        if (allStudents[i].lastName != null) {
            allStudents[i].image = allStudents[i].lastName.charAt(0).toLowerCase() + allStudents[i].lastName.substring(1) + "_" + allStudents[i].firstName.charAt(0).toLowerCase() + ".png";
        } else {
            allStudents[i].image = null;
        }

        if (allStudents[i].lastName == "Patil") {
            allStudents[i].image = allStudents[i].lastName.charAt(0).toLowerCase() + allStudents[i].lastName.substring(1) + "_" + allStudents[i].firstName.toLowerCase() + ".png";
        }

        if (allStudents[i].lastName == " ") {
            allStudents[i].image = allStudents[i].firstName.toLowerCase() + ".png";
        }

        if (allStudents[i].lastName == "Finch-fletchley") {
            allStudents[i].image = allStudents[i].lastName.substring(6) + "_" + allStudents[i].firstName.charAt(0).toLowerCase() + ".png";
        }
    }

    addingIDnumber();

}

function prepareBlood(family) {

    allStudents.forEach((student) => {
        if (family.pure.includes(student.lastName)) {
            student.blood = "Pure Blood";
        } else if (family.half.includes(student.lastName)) {
            student.blood = "Half Blood";
        } else {
            student.blood = "Muggle-born";
        }
    });

    allStudents.forEach(elem => fillCartouche(elem));

}

function addingIDnumber() {
    let i = 0;

    allStudents.forEach((student) => {
        student.id = i;
        i++;
    })
}

const grid = document.querySelector(".grid");


// putting the counters here for convenience; 

const global_counter = document.querySelector("body > header > div.tracking_wrapper > div:nth-child(1) > span");
const gryffindor_visual_counter = document.querySelector("body > header > div.tracking_wrapper > div.tracking.tracking_houses > p:nth-child(1) > span");
const slytherin_visual_counter = document.querySelector("body > header > div.tracking_wrapper > div.tracking.tracking_houses > p:nth-child(2) > span");
const hufflepuff_visual_counter = document.querySelector("body > header > div.tracking_wrapper > div.tracking.tracking_houses > p:nth-child(3) > span");
const ravenclaw_visual_counter = document.querySelector("body > header > div.tracking_wrapper > div.tracking.tracking_houses > p:nth-child(4) > span");

const expelled_visual_counter = document.querySelector("body > header > div.tracking_wrapper > div:nth-child(3) > span");

let id_card = 0;
let cartouche_counter = 0;
let expelled_counter = 0;
let gryffindor_counter = 0;
let slytherin_counter = 0;
let hufflepuff_counter = 0;
let ravenclaw_counter = 0;

function fillCartouche(elem) {

    //create clone;
    const copy = document.querySelector("template").content.cloneNode(true);

    //fill clone;

    copy.querySelector("img").src = `images/${elem.image}`;
    copy.querySelector("h1").textContent = elem.firstName + " " + elem.lastName;
    copy.querySelector(".house").textContent = elem.house;
    copy.querySelector(".blood").textContent = elem.blood;
    copy.querySelector(".cartouche").dataset.id = elem.id;
    copy.querySelector(".cartouche").classList.add(`${elem.house}`);
    copy.querySelector(".cartouche").addEventListener("click", fillModal);

    if (elem.prefect == true) {
        copy.querySelector(".prefect-tag").style.display = "block";
    }

    if (elem.inquisition == true) {
        copy.querySelector(".inquisition-tag").style.display = "block";
    }

    if (elem.expelled == true) {
        copy.querySelector(".cartouche").classList.add("Expelled");
        copy.querySelector(".cartouche").style.backgroundColor = "grey";
        copy.querySelector(".house").textContent = "Expelled";
    }
    // add clone to grid;
    grid.appendChild(copy);

    //this should probably be a function in itself;
    //counting stuff when created 
    switch (true) {
        case (elem.house == "Gryffindor"):
            gryffindor_counter++;
            break;

        case (elem.house == "Slytherin"):
            slytherin_counter++;
            break;

        case (elem.house == "Hufflepuff"):
            hufflepuff_counter++;
            break;

        case (elem.house == "Ravenclaw"):
            ravenclaw_counter++;
            break;

    }


    cartouche_counter++;

    global_counter.innerHTML = cartouche_counter;
    gryffindor_visual_counter.innerHTML = gryffindor_counter;
    slytherin_visual_counter.innerHTML = slytherin_counter;
    hufflepuff_visual_counter.innerHTML = hufflepuff_counter;
    ravenclaw_visual_counter.innerHTML = ravenclaw_counter;

}

function ResetAllCounters() {
    cartouche_counter = 0;
    gryffindor_counter = 0;
    slytherin_counter = 0;
    hufflepuff_counter = 0;
    ravenclaw_counter = 0;
}
// working on the filters 

const gryffindor_check = document.querySelector("#gryffindor_checkbox");
const slytherin_check = document.querySelector("#slytherin_checkbox");
const hufflepuff_check = document.querySelector("#hufflepuff_checkbox");
const ravenclaw_check = document.querySelector("#ravenclaw_checkbox");

const allchecks = document.querySelectorAll("input");

let houseFiltered = [];
let bloodFiltered = [];
let showing = [];

//THAT'S THE FILTER - IT IS PROBABLY WHAT YOU ARE LOOKING FOR
//THAT'S THE FILTER - IT IS PROBABLY WHAT YOU ARE LOOKING FOR
//THAT'S THE FILTER - IT IS PROBABLY WHAT YOU ARE LOOKING FOR

allchecks.forEach((e) =>
    e.addEventListener("change", function () {

        ResetAllCounters();
        grid.innerHTML = "";
        showing = [];

        // starting the condition if the checkbox was a house
        if (e.classList.contains("house_check")) {

            // if the house was checked, it will add it to an array
            if (e.checked) {

                const filtered = allStudents.filter(student => student.house == e.dataset.house);
                filtered.forEach(card => houseFiltered.push(card));
            }

            else {
                // if the house was unchecked, it will remove it from the array
                houseFiltered = houseFiltered.filter(student => student.house != e.dataset.house);
            }
        }

        // starting the condition if the checkbox was a house 
        else {
            // if the house was checked, it will add it to an array
            if (e.checked) {
                const filtered = allStudents.filter(student => student.blood == e.dataset.blood);
                filtered.forEach(card => bloodFiltered.push(card));
            }

            else {
                // if the blood was unchecked, it will remove it from the array
                bloodFiltered = bloodFiltered.filter(student => student.blood != e.dataset.blood);
            }
        }

        // Checking that the students aren't filtered by blood at this moment
        allStudents.forEach((student) => {
            if (houseFiltered.includes(student)) {
                showing.push(student);
            }
        });

        // if there isn't any filter on, I need to show all students
        if (houseFiltered == "") {
            allStudents.forEach((student) => {
                showing.push(student);
            })
        }

        // check if there is a blood filter on 
        if (bloodFiltered != "") {
            showing = showing.filter(checkingBlood);
        }

        // compares what is currently showed, with what is filtered by blood
        function checkingBlood(ref) {
            return bloodFiltered.includes(ref);
        }

        // runs the view function with what should be shown
        showing.forEach(student => fillCartouche(student));
    }

    ));

// Adding a modal 

const modal_background = document.querySelector(".modal-background");
modal_background.addEventListener("click", closeModal);

//gets everything from the modal

const modal_content = document.querySelector("body > div.modal-background > div");
const portrait = document.querySelector("body > div.modal-background > div > figure > img");
const sigil = document.querySelector("body > div.modal-background > div > img");
const modal_name = document.querySelector("body > div.modal-background > div > div > h1");
const modal_house = document.querySelector("body > div.modal-background > div > div > div > p.modal_house");
const modal_blood = document.querySelector("body > div.modal-background > div > div > div > p.modal_blood");

const make_prefect_button = document.querySelector(".make-prefect");
const make_inquisition_button = document.querySelector(".make-squad");
const make_expelled_button = document.querySelector(".make-expelled");

function fillModal() {
    // sets it to everything from the student card

    // needed to redisplay in case someone was expelled before;
    make_prefect_button.style.display = "block";
    make_inquisition_button.style.display = "block";
    make_expelled_button.style.display = "block";

    portrait.style.display = "block";
    sigil.style.display = "block";

    modal_content.style.backgroundColor = "white";
    modal_content.style.border = "solid 10px var(--house-color)";


    portrait.src = this.querySelector("img").src;
    modal_name.textContent = this.querySelector("h1").textContent;
    modal_house.textContent = this.querySelector(".house").textContent;
    modal_blood.textContent = this.querySelector(".blood").textContent;
    make_prefect_button.dataset.student = this.dataset.id;
    make_inquisition_button.dataset.student = this.dataset.id;
    make_expelled_button.dataset.student = this.dataset.id;

    // inspired by conversation with Nitzan
    const houses_style = ["Gryffindor", "Slytherin", "Hufflepuff", "Ravenclaw"];
    houses_style.forEach((e) => modal_background.classList.remove(e));

    //starts visual with houses
    switch (true) {
        case this.classList.contains("Slytherin"):
            modal_background.classList.add("Slytherin");
            sigil.src = "/assets/Slytherin_ClearBG.png"
            break;

        case this.classList.contains("Gryffindor"):
            modal_background.classList.add("Gryffindor");
            sigil.src = "/assets/Gryffindor_ClearBG.png"

            break;

        case this.classList.contains("Hufflepuff"):
            modal_background.classList.add("Hufflepuff");
            sigil.src = "/assets/Hufflepuff_ClearBG.png"

            break;

        case this.classList.contains("Ravenclaw"):
            modal_background.classList.add("Ravenclaw");
            sigil.src = "/assets/Ravenclaw_ClearBG.png"

            break;
    }

    // questin of the prefect (problably inquisition after)
    if (this.querySelector(".prefect-tag").style.display == "block") {
        document.querySelector("body > div.modal-background > div > div > div.tags > div.prefect-tag").style.display = "block";
    } else {
        document.querySelector("body > div.modal-background > div > div > div.tags > div.prefect-tag").style.display = "none";
    }

    // well, well, well, if it isn't the inquisition?
    if (this.querySelector(".inquisition-tag").style.display == "block") {
        document.querySelector("body > div.modal-background > div > div > div.tags > div.inquisition-tag").style.display = "block";
    } else {
        document.querySelector("body > div.modal-background > div > div > div.tags > div.inquisition-tag").style.display = "none";
    }

    if (this.classList.contains("Expelled")) {
        DisplayExpelledModal();
        console.log("running this");
    }

    showModal();
}

function DisplayExpelledModal() {

    modal_content.style.backgroundColor = "grey";
    modal_content.style.border = "none";

    portrait.style.display = "none";
    modal_house.textContent = "Expelled";
    make_prefect_button.style.display = "none";
    make_inquisition_button.style.display = "none";
    make_expelled_button.style.display = "none";
    sigil.style.display = "none";

}

function showModal() {
    modal_background.style.display = "block";
}

function closeModal(e) {
    if (e.target == modal_background) {
        modal_background.style.display = "none";
    }
}

// starting on the prefect and inquisitions
// creating arrays to go through and find who is a prefect
const gryffindor_prefect = [];
const slytherin_prefect = [];
const hufflepuff_prefect = [];
const ravenclaw_prefect = [];

// csetting conditions for the array

const allCartouche_list = document.querySelector(".grid").children;

make_prefect_button.addEventListener("click", MakePrefect);

function MakePrefect() {
    toArray(allCartouche_list);
    SearchThroughCartouche(this);
}

// going through all of the existing divs to match the button dataset with the div dataset
function SearchThroughCartouche(ref) {

    console.log(ref);
    allStudents.forEach(student => {
        if (ref.dataset.student == student.id) {
            switch (true) {
                case student.house == "Slytherin":

                    if (slytherin_prefect.length == 2) {
                        alert("This will remove an existing prefect");
                        student.prefect = true;

                        RemoveTag("slytherin");
                        slytherin_prefect[0].prefect = false;
                        slytherin_prefect.splice(0, 1);
                        slytherin_prefect.push(student);

                    } else {
                        student.prefect = true;
                        slytherin_prefect.push(student);
                    }
                    break;

                case student.house == "Gryffindor":

                    if (gryffindor_prefect.length == 2) {
                        alert("This will remove an existing prefect");
                        student.prefect = true;

                        RemoveTag("gryffindor");
                        gryffindor_prefect[0].prefect = false;
                        gryffindor_prefect.splice(0, 1);
                        gryffindor_prefect.push(student);

                    } else {
                        student.prefect = true;
                        gryffindor_prefect.push(student);
                    }
                    break;

                case student.house == "Hufflepuff":

                    if (hufflepuff_prefect.length == 2) {
                        alert("This will remove an existing prefect");
                        student.prefect = true;

                        RemoveTag("hufflepuff");
                        hufflepuff_prefect[0].prefect = false;
                        hufflepuff_prefect.splice(0, 1);
                        hufflepuff_prefect.push(student);

                    } else {
                        student.prefect = true;
                        hufflepuff_prefect.push(student);
                    }
                    break;

                case student.house == "Ravenclaw":

                    if (ravenclaw_prefect.length == 2) {
                        alert("This will remove an existing prefect");
                        student.prefect = true;

                        RemoveTag("ravenclaw");
                        ravenclaw_prefect[0].prefect = false;
                        ravenclaw_prefect.splice(0, 1);
                        ravenclaw_prefect.push(student);

                    } else {
                        student.prefect = true;
                        ravenclaw_prefect.push(student);
                    }
                    break;
            }
            ChangeVisualPrefect(student);
        }
    })
}


// change Nodelist to Array from 
//https://stackoverflow.com/questions/2735067/how-to-convert-a-dom-node-list-to-an-array-in-javascript

const allCartouche = [];

function toArray(allCartouche_list) {

    for (let i = allCartouche_list.length - 1; i > -1; i--) {
        allCartouche[i] = allCartouche_list[i];
    }
}

function ChangeVisualPrefect(student) {

    allCartouche.forEach((cartouche) => {
        if (cartouche.dataset.id == student.id) {
            document.querySelector("body > div.modal-background > div > div > div.tags > div.prefect-tag").style.display = "block";
            cartouche.querySelector(".prefect-tag").style.display = "block";
        }
    })
}

// will look for the object that was changed (the first one in the array), and will change the style of the tag to none;
// the objects itself is removed from the array in the function before;

function RemoveTag(house) {
    switch (true) {
        case house == "slytherin":
            allCartouche.forEach(cards => {
                if (cards.dataset.id == slytherin_prefect[0].id) {
                    cards.querySelector(".prefect-tag").style.display = "none";
                }
            })
            break;
        case house == "gryffindor":
            allCartouche.forEach(cards => {
                if (cards.dataset.id == gryffindor_prefect[0].id) {
                    cards.querySelector(".prefect-tag").style.display = "none";
                }
            })
            break;
        case house == "hufflepuff":
            allCartouche.forEach(cards => {
                if (cards.dataset.id == hufflepuff_prefect[0].id) {
                    cards.querySelector(".prefect-tag").style.display = "none";
                }
            })
            break;
        case house == "ravenclaw":
            allCartouche.forEach(cards => {
                if (cards.dataset.id == ravenclaw_prefect[0].id) {
                    cards.querySelector(".prefect-tag").style.display = "none";
                }
            })
            break;
    }
}

//starting on the inquisition squad

make_inquisition_button.addEventListener("click", MakeInquisition);

function MakeInquisition() {

    //finding the corresponding cartouche;
    toArray(allCartouche_list);
    SearchingThroughCartouche2(this);

}

function SearchingThroughCartouche2(ref) {

    console.log(ref);
    allCartouche.forEach(student => {

        if (ref.dataset.student == student.dataset.id) {
            if (student.querySelector(".blood").textContent == "Pure Blood") {
                JoinInquisition(student);
                ChangeSquadObject(ref);
            }
            else {
                alert("A student needs to be Pure Blood to join the squad")
            };
        }
    })
}

function ChangeSquadObject(ref) {

    allStudents.forEach(student => {
        if (student.id == ref.dataset.student) {
            student.inquisition = true;
        }
    })
}
const InquisitionSquad = [];

function JoinInquisition(student) {

    InquisitionSquad.push(student);

    if (InquisitionSquad.includes(student)) {
        document.querySelector("body > div.modal-background > div > div > div.tags > div.inquisition-tag").style.display = "block";
        student.querySelector(".inquisition-tag").style.display = "block";
    }
    else {
        document.querySelector("body > div.modal-background > div > div > div.tags > div.inquisition-tag").style.display = "none";

    }

    if (hacked == true) {
        setTimeout(function () {
            //remove from array
            let placement = InquisitionSquad.indexOf(student);
            InquisitionSquad.splice(placement, 1);

            //remove from object
            allStudents.forEach(ref => {
                if (student.dataset.id == ref.id) {
                    ref.inquisition = false;
                }
            });
            //remove visual
            document.querySelector("body > div.modal-background > div > div > div.tags > div.inquisition-tag").style.display = "none";
            student.querySelector(".inquisition-tag").style.display = "none";

        }, 1500);
    }

}

// starting on filters

const filterPrefect = document.querySelector("#Prefect-filter");
filterPrefect.addEventListener("click", filteringPrefect);

let clicked = false;

function filteringPrefect() {

    ResetAllCounters();
    grid.innerHTML = "";
    filterPrefect.classList.toggle("active");

    if (clicked == false) {

        console.log("this actives the filter");

        if (showing == "") {
            console.log("there isn't a house or blood filter")
            //it means that there is NOT any filtering by houses or blood 
            let filteredPrefect = allStudents.filter(student => student.prefect == true);

            console.log(filteredPrefect);

            filteredPrefect.forEach(prefect => fillCartouche(prefect));
        } else {
            // it means there is a filter of house or blood ON
            let filteredPrefect = showing.filter(student => student.prefect == true);
            filteredPrefect.forEach(prefect => fillCartouche(prefect));
        }

        clicked = true;
    }

    else {

        console.log("it desactivates the filter");

        if (showing == "") {
            console.log("there wasn't a house or blood filter => so it should show everything again")
            //it means that there is NOT any filtering by houses or blood 
            allStudents.forEach(all => fillCartouche(all));
        }

        else {
            console.log("there WAS a house or blood filter => so it should show what there was before")
            // it means there is a filter of house or blood ON
            showing.forEach(all => fillCartouche(all));
        }

        clicked = false;
    }
}

// same filter for inquisition - didn't success in passing a variable

const filterSquad = document.querySelector("#Squad-filter");
filterSquad.addEventListener("click", filteringSquad);

let clickedSquad = false;

function filteringSquad() {

    ResetAllCounters();
    grid.innerHTML = "";

    filterSquad.classList.toggle("active");
    if (clickedSquad == false) {

        console.log("this actives the filter");

        if (showing == "") {
            console.log("there isn't a house or blood filter")
            //it means that there is NOT any filtering by houses or blood 
            let filteredSquad = allStudents.filter(student => student.inquisition == true);
            filteredSquad.forEach(squad => fillCartouche(squad));

        } else {
            // it means there is a filter of house or blood ON
            let filteredSquad = showing.filter(student => student.inquisition == true);
            filteredSquad.forEach(squad => fillCartouche(squad));
        }

        clickedSquad = true;
    }

    else {

        console.log("it desactivates the filter");

        if (showing == "") {
            console.log("there wasn't a house or blood filter => so it should show everything again")
            //it means that there is NOT any filtering by houses or blood 
            allStudents.forEach(all => fillCartouche(all));
        }

        else {
            console.log("there WAS a house or blood filter => so it should show what there was before")
            // it means there is a filter of house or blood ON
            showing.forEach(all => fillCartouche(all));
        }

        clickedSquad = false;
    }
}

// start on sorting ?

const house_button = document.querySelector("#house_sort");
const blood_button = document.querySelector("#blood_sort");
const name_button = document.querySelector("#name_sort");

house_button.addEventListener("click", SortDisplay);
blood_button.addEventListener("click", SortDisplay);
name_button.addEventListener("click", SortDisplay);

let house_flag = false;
let blood_flag = false;
let name_flag = false;

function SortDisplay(param) {
    let input = param.target.dataset.id;

    //checking which sorting will be needed
    ResetAllCounters();
    grid.innerHTML = "";
    if (input == "house") {
        State_SortbyHouse();
    } else if (input == "blood") {
        State_SortbyBlood();
    } else if (input == "name") {
        State_SortbyName();
    }
}

// checking if it was sorted before to change the order
// checking for the house

function State_SortbyHouse() {
    if (house_flag == false) {
        console.log("i am sorting by house for the first time");

        house_flag = true;
        document.querySelector("#arrow_house").classList.toggle("up");

        SortbyHouse();

    } else {
        console.log("i am sorting by house for the second time");

        house_flag = false;
        document.querySelector("#arrow_house").classList.toggle("up");

        SortbyAntiHouse();
    }
};

//checking for the blood
function State_SortbyBlood() {
    if (blood_flag == false) {
        console.log("i am sorting by blood for the first time");

        blood_flag = true;
        document.querySelector("#arrow_blood").classList.toggle("up");

        SortbyBlood();

    } else {
        console.log("i am sorting by blood for the second time");

        blood_flag = false;
        document.querySelector("#arrow_blood").classList.toggle("up");

        SortbyAntiBlood();
    }
};

//checking for the name
function State_SortbyName() {
    if (name_flag == false) {
        console.log("i am sorting by name for the first time");

        name_flag = true;
        document.querySelector("#arrow_name").classList.toggle("up");

        SortbyName();

    } else {
        console.log("i am sorting by name for the second time");

        name_flag = false;
        document.querySelector("#arrow_name").classList.toggle("up");

        SortbyAntiName();
    }
};

// sorts all students by alphabetical order of their last name
function SortbyName() {
    let name_sorted = allStudents.sort(function (a, b) {
        if (a.lastName < b.lastName) {
            return -1;
        }
        if (a.lastName > b.lastName) {
            return 1;
        }
        return 0;
    });

    console.log(name_sorted);
    name_sorted.forEach(name => fillCartouche(name));
};

// sorts all students by alphabetical order of their house
function SortbyHouse() {
    let house_sorted = allStudents.sort(function (a, b) {
        if (a.house < b.house) {
            return -1;
        }

        if (a.house > b.house) {
            return 1;
        }

        return 0;
    });

    house_sorted.forEach(house => fillCartouche(house));
};

// sorts all students by alphabetical order of their blood 
function SortbyBlood() {
    let blood_sorted = allStudents.sort(function (a, b) {
        if (a.blood < b.blood) {
            return -1;
        }
        if (a.blood > b.blood) {
            return 1;
        }
        return 0;
    });

    blood_sorted.forEach(blood => fillCartouche(blood));
};

// doing the same thing but the other way around 
// sorts all students by alphabetical order of their last name
function SortbyAntiName() {
    let anti_name_sorted = allStudents.sort(function (a, b) {
        if (a.lastName < b.lastName) {
            return 1;
        }
        if (a.lastName > b.lastName) {
            return -1;
        }
        return 0;
    });

    anti_name_sorted.forEach(name => fillCartouche(name));
};

// sorts all students by alphabetical order of their house
function SortbyAntiHouse() {
    let anti_house_sorted = allStudents.sort(function (a, b) {
        if (a.house < b.house) {
            return 1;
        }

        if (a.house > b.house) {
            return -1;
        }

        return 0;
    });

    anti_house_sorted.forEach(house => fillCartouche(house));
};

// sorts all students by alphabetical order of their blood 
function SortbyAntiBlood() {
    let anti_blood_sorted = allStudents.sort(function (a, b) {
        if (a.blood < b.blood) {
            return 1;
        }
        if (a.blood > b.blood) {
            return -1;
        }
        return 0;
    });

    anti_blood_sorted.forEach(blood => fillCartouche(blood));
};


//Starting on search function
//Starting on search function
//Starting on search function

// The search doesn't work with filters ON
// I REPEAT: the search doesn't work with filters on, please don't try it
// it breaks the system for now

const search_input = document.querySelector("body > header > nav > input[type=text]");
search_input.addEventListener("input", function () {

    ResetAllCounters();
    grid.innerHTML = "";
    const SearchedValue = search_input.value.toLowerCase();

    if (SearchedValue == "godmode") {
        hackTheSystem();
    }
    else {
        const showing_searched = allStudents.filter(student =>
            student.firstName.toLowerCase().includes(SearchedValue) || student.lastName.toLowerCase().includes(SearchedValue));
        showing_searched.forEach(student => fillCartouche(student));
    }
})

// starting on the expel, expelled function

make_expelled_button.addEventListener("click", MakeExpelled);

function MakeExpelled() {

    expelled_counter++;
    expelled_visual_counter.textContent = expelled_counter;

    toArray(allCartouche_list);

    allStudents.forEach((student) => {
        if (student.id == this.dataset.student) {
            if (Object.isFrozen(student) == true) {
                hackingDetected();
            }

            allStudents.splice(allStudents.indexOf(student), 1);
            student.expelled = true;
        }
    });

    allCartouche.forEach((cartouche) => {
        if (cartouche.dataset.id == this.dataset.student) {
            cartouche.classList.add("Expelled");
            cartouche.style.backgroundColor = "grey";
            cartouche.querySelector(".house").textContent = "Expelled";
        }
    });

    DisplayExpelledModal();
}

// Starting on the hacking Function 

let hacked = false;
function hackTheSystem() {


    if (hacked == true) {
        alert("you have already been hacked");
    }
    else {
        changingBlood();

        const hacker = {
            id: "666",
            firstName: "Sylvain",
            middleName: null,
            lastName: "Buisson",
            house: "Ravenclaw",
            image: "hacker.jpg",
            blood: "Pure Blood",
            prefect: true,
            inquisition: true,
        }

        Object.freeze(hacker);

        //hacker.addEventListener("change", NoNofunction);
        allStudents.push(hacker);

        hacked = true;
    }
}

function changingBlood() {

    allStudents.forEach(student => {
        console.log(student);
        if (student.blood == "Pure Blood" || student.blood == "Half Blood") {

            // from that time Peter wrote it in front of us
            const values = ["Pure Blood", "Half Blood", "Muggle-born"];
            student.blood = values[Math.floor(Math.random() * values.length)];

        } else {
            student.blood = "Pure Blood";
        }
    })

    console.log(allStudents);
}

function hackingDetected() {

    console.log("starting");

    const AlertBox = document.createElement("div");
    AlertBox.classList.add("alert-box");
    document.body.appendChild(AlertBox);

    const gif = document.createElement("img");
    AlertBox.appendChild(gif);

    gif.src = "assets/no.gif";

    for (let i = 0; i < 6; i++) {
        const para = document.createElement("p");
        para.classList.add("blinking");
        AlertBox.appendChild(para);
        para.textContent = "You are messing with the wrong student";
    }

    AlertBox.addEventListener("click", function () {
        AlertBox.style.display = "none";
    })
}



