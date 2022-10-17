/*
This is a 
block comment
*/

let num = 100; //integer
let num1 = 200;

//function foo() {
//    console.log(num);
//    let num1 = 200;
//};

//foo();

console.log(num1)

let anonFun = function(){
    console.log("hello")
};

//immediately invoked
(function(){
    console.log("Hello");
})();

(() => console.log(100))();

//function foo(){
//    console.log(num);
//};

let foo = () => console.log(num);

let bar = 100;
bar = 200;

let arr = ["foo", 123, ["zar", "car"]];

console.log(arr[1]);

// Set item in array
arr[1] = "barbar";

// Add item to the end of the array
arr.push("par");

// Removing an item from the array (index, number of things to delete)
arr.splice(1,2);

console.log(arr[1]);

let newArr = ["cow", "turtle", "goat"];

for (let item of newArr){
    console.log(item);
}

for (let i of newArr){
    console.log(i + " " + newArr[i]);
}

newArr.forEach((item, i) => console.log(i + " " + item));

//objects

let obj1 = {
    name: "Jill",
    age: 85,
    job: "Cactus Hunter"
};

//Access property

console.log(obj1.name);
console.log(obj1["name"]);

obj1.job = "Barista";

//loop through all properties

for (let key in obj1) {
    let value = obj1[key];
    console.log(`${key}: ${value}`);
}

let val = 80;

if (val > 80) {
    console.log("good")
} else if (val > 50) {
    console.log("ok")
} else {
    console.log("terrible")
}

let y = (val >= 80) ? console.log("good") : console.log("not good")

let newVar = document.getElementById("example");

newVar.innerHTML += "Hello World!"