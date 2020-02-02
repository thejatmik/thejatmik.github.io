let leleKey = "leleToDo";
let input = document.createElement("input");
input.type = 'text';
input.placeholder = 'Type here then ENTER to Add New ToDo';
input.id = "input-tbox";
input.addEventListener('keyup', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        //function to append value to list;
        this.additem();
        this.value = "";
    };
});
input.additem = function () {
    if (this.value === "") return;
    let lastItem = 0;
    for (let i=0; i<leleList.length; i++) {
        if (!leleList[i]) continue;
        if (leleList[i].id>lastItem) lastItem=leleList[i].id;
    };
    lastItem++;
    let added = false;
    for (let i=0; i<leleList.length; i++) {
        if (!leleList[i]) {
            leleList[i]= {
                id: lastItem,
                cat: "todo",
                text: this.value+""
            };
            added = true;
            break;
        };
    };
    if (!added) {
        leleList.push({
            id: lastItem,
            cat: "todo",
            text: this.value+""
        });
    };
    this.value = "";
    loadLele();
};
document.body.appendChild(input);

//THE LIST! and add some methods
let leleList;
//load from localStorage if available
if (typeof(Storage) !== "undefined") {
    // Code for localStorage
    if (!window.localStorage.getItem('leleTodo')) leleList = JSON.parse(window.localStorage.getItem(leleKey));
};
if (!leleList) leleList = [];
leleList.nextCat = function(itemId) {
    let focused = this[0];
    for (let i=0; i<this.length; i++) {
        if (!this[i]) continue;
        if (this[i].id === Number(itemId.substr(4))) {
            focused = this[i];
            break;
        };
    };
    if (focused.cat == "todo") focused.cat = "ongo";
    else if (focused.cat == "ongo") focused.cat = "comp";
    loadLele();
};
leleList.prevCat = function(itemId) {
    let focused = this[0];
    for (let i=0; i<this.length; i++) {
        if (!this[i]) continue;
        if (this[i].id === Number(itemId.substr(4))) {
            focused = this[i];
            break;
        };
    };
    if (focused.cat == "ongo") focused.cat = "todo";
    else if (focused.cat == "comp") focused.cat = "ongo";
    loadLele();
};
leleList.removeMe = function(itemId) {
    let index = 0;
    for (let i=0; i<this.length; i++) {
        if (!this[i]) continue;
        if (this[i].id === Number(itemId.substr(4))) {
            index = i;
            break;
        };
    };
    this[index]=undefined;
    loadLele();
};
leleList.changeText = function(itemId, text) {
    let focused = this[0];
    for (let i=0; i<this.length; i++) {
        if (!this[i]) continue;
        if (this[i].id === Number(itemId.substr(4))) {
            focused = this[i];
            break;
        };
    };
    focused.text = text;
    loadLele();
};

//THE ITEM! inputs are each element in list. output as node in div#container for each category
class MakeTextList {
    constructor (_id, _text, _category="test", _tag="div") {
        this.itemId = _id; //div id
        this.category = _category;
        this.text = _text;
        this.tag = _tag;
    };
    
    get id() {
        return this.category+this.itemId;
    };
    get content() {
        //make item div
        let a = document.createElement(this.tag)

        //give style
        a.style.padding = '0px 5px 0px 0px';
        a.style.margin = '3px 0px';

        //input node details
        a.id = this.id;

        //return text content
        if (this.category!=="todo") a.appendChild(this.arrowLeft);
        if (this.category!=="comp") a.appendChild(this.arrowRight);
        a.appendChild(this.tbox);
        a.appendChild(this.trashBin);
        return a;
    };
    get arrowLeft() {
        let a = document.createElement('span');
        a.innerHTML = '<i class="fas fa-arrow-left fa-lg"></i>';
        a.onclick = function() {leleList.prevCat(this.parentNode.id)};
        return a;
    };
    get arrowRight() {
        let a = document.createElement('span');
        a.innerHTML = '<i class="fas fa-arrow-right fa-lg"></i>';
        a.transform = 'scale(2)';
        a.onclick = function() {leleList.nextCat(this.parentNode.id)};
        return a;
    };
    get checkbox() {
        let a = document.createElement('input');
        a.type = 'checkbox';
        a.onclick = function() {leleList.nextCat(this.parentNode.id)};
        return a;
    };
    get tbox() {
        // let a = document.createElement('input');
        // a.type = 'text';
        let a = document.createElement('textarea');
        a.wrap = 'soft';
        a.style.width = '75%';
        a.rows = 1;
        a.style.border = 'none';
        a.style.fontSize = '20px';
        a.style.borderRadius = '4px';
        a.style.backgroundColor = 'transparent';
        a.value = this.text;

        a.addEventListener('focusout', function(event) {
            // if (event.keyCode === 13) {
            //     event.preventDefault();
            //     //function to append value to list;
            //     this.text = a.value;
            //     leleList.changeText(this.parentNode.id, a.value);
            // }
            event.preventDefault();
            //function to append value to list;
            this.text = a.value;
            leleList.changeText(this.parentNode.id, a.value);
        });
        return a;
    };
    get trashBin() {
        let a = document.createElement('span');
        a.innerHTML = '<i class="fas fa-trash-alt"></i>';
        a.ondblclick = function() {leleList.removeMe(this.parentNode.id)};
        a.style.alignItems = 'right';
        return a;
    };
    get xMark() {
        let a = document.createElement('span');
        a.appendChild(document.createTextNode(' REMOVE '));
        a.style.fontSize = '13px';
        a.style.textAlign = 'right';
        a.style.cursor = 'pointer';
        a.ondblclick = function() {leleList.removeMe(this.parentNode.id)};
        return a;
    };
};

MakeTextList.prototype.postToContainer = function() {
    //find div container
    let container = document.getElementById(this.category+'-container');
    if (container) {
        container.appendChild(this.content);
        return container;
    };

};
// DISPLAY!
let categ = ['todo', 'ongo', 'comp'];
var loadLele = function() {
    //save list
    if (typeof(Storage) !== "undefined") {
        // Code for localStorage
        window.localStorage.setItem(leleKey, JSON.stringify(leleList));
    };
    clearLele();
    printLele();
};
function clearLele() {
    for (let i=0; i<categ.length; i++) {
        let item = document.getElementById(''+categ[i]+'-container')
        // if (!item) continue;
        while (item.firstChild) {
            item.removeChild(item.firstChild);
        };
    };
};
function printLele() {
    for (let i=0; i<leleList.length; i++) {
        if (leleList[i]) {
            new MakeTextList(leleList[i].id,leleList[i].text, leleList[i].cat).postToContainer();
        };
    };
};

//mandatory lelegoyang
function pauseAnimation() {
    if (document.body.style.animationPlayState === 'paused') {
        document.body.style.animationPlayState = 'running';
    } else {
        document.body.style.animationPlayState = 'paused';
    };
};
let lele = document.getElementById("lele");
lele.style.transform = 'rotate(10deg)';
lele.style.transition = '0.1s';
lele.onclick = function() {pauseAnimation()};
let rotateA = function() {
    if (lele.style.transform === 'rotate(10deg)') lele.style.transform = 'rotate(-10deg)';
    else lele.style.transform = 'rotate(10deg)';
};
setInterval(rotateA, 1000);
// lele.style.display = 'none';
// document.body.onload = loadLele();