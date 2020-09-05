"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

const student = {
    firstName: "",
    middleName: "",
    lastNAme: "",
    gender: "",
    house: "",
};

function start() {
    console.log("ready");

    loadJSON();
}


function loadJSON() {
    fetch("https://petlatkea.dk/2020/hogwarts/students.json")
        .then(response => response.json())
        .then(jsonData => {
            // when loaded, prepare objects
            prepareObjects(jsonData);
        });
}

function prepareObjects(jsonData) {
    jsonData.forEach(jsonObject => {

        console.log(jsonObject);

        let students = Object.create(student);
        let newName = jsonObject.fullname.split(" ");

        students.firstName = newName[0];
        students.middleName = newName[1];
        students.lastNAme = newName[2];

        /*         let animals = Object.create(animal);
        
                let newName = jsonObject.fullname.split(" ");
        
                animals.name = newName[0];
                animals.type = newName[3];
                animals.desc = newName[2];
                animals.age = jsonObject.age;
        
                allAnimals.push(animals);
                console.log(animals); */
        // TODO: Create new object with cleaned data - and store that in the allAnimals array

        // TODO: MISSING CODE HERE !!!
    });

    displayList();
}

function displayList() {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    allStudents.forEach(displayAnimal);
}

function displayAnimal(animal) {
    // create clone
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}


