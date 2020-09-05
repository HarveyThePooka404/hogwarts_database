"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

const student = {
    firstName: "",
    middleName: null,
    lastNAme: null,
    gender: "",
    house: "",
    image: "",
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

        allStudents.push(students);
    });

    for (let i = 0; i < allStudents.length; i++) {


        let restOftheFirst = allStudents[i].firstName.substring(1).toLowerCase();
        allStudents[i].firstName = allStudents[i].firstName.charAt(0).toUpperCase() + restOftheFirst;

        if (allStudents[i].middleName != null) {
            let restOftheMiddle = allStudents[i].middleName.substring(1).toLowerCase();
            allStudents[i].middleName = allStudents[i].middleName.charAt(0).toUpperCase() + restOftheMiddle;
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
    }

    console.table(allStudents);
}


