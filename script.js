
// DOM initializations with every node to be used.
let body = document.querySelector('body');
let buttonAdd = document.querySelector('.add');
let buttonSaved = document.querySelector('.saved');
let buttonNote = document.querySelector('.note');
let buttonDelete = document.querySelector  ('.delete');
    buttonDelete.innerHTML = '_';
let buttonSave = document.querySelector('.save');
let textNote = document.querySelector('textarea');
textNote.addEventListener('click',()=>{savedNote.style.visibility = 'hidden'; });
let section = document.querySelector('section');
let savedNote = document.querySelector('#savedNote');
let edit = document.querySelector('.edit');
edit.addEventListener('click', ()=>{ textNote.readOnly = false;}); //in use now.
let padList = document.querySelector('.padList');
let paddiv =document.querySelector('.padDiv');

// creating new note pads....
buttonAdd.addEventListener('click', createPad);

// local storage for added(created) note pads
let padStorage = sessionStorage.getItem('notepad') 
? JSON.parse(sessionStorage.getItem('notepad')):[];

//new notes number (a number tag on every newly created notes for identification)........ 
let noteCount = 1;

// adding note event-function trigger........
function createPad(){
    
        padStorage.push(buttonNote.innerHTML);
        sessionStorage.setItem('notepad', JSON.stringify(padStorage));
        createNewPad(buttonNote.innerHTML);
        paddiv.style.visibility = 'hidden';
    
}

//modalforms indexing.................
let modalIndex = [];

//re-rendering created notes on web at refresh...........
console.log(padStorage.length);
for(let x of padStorage){
    createNewPad(x);
}


//create note event-function............
let selectedPad = null;
function createNewPad(newpad){ //parameter
    noteCount++
 var create = newpad;
 let pad = document.createElement('div'); //or //pad = buttonNote.cloneNode(true);  //advanced duplicate.  
 pad.className = 'Note Pad '+noteCount;
 pad.innerHTML = create;
 pad.style.display = 'inline-block';
 pad.style.margin = '5px';
 section.appendChild(pad);
//  notepad delete fn
 const del = pad.querySelector('.delete');
 del.innerHTML = '<i onclick="discardNotePad(this)" class="fa-solid fa-trash-can"></i>';
 // notepad save fn
 const sav = pad.querySelector('.save');
 sav.innerHTML = '<span onclick="saveData(this)"><i class="fa-solid fa-floppy-disk"></i>save</span>';
 // notepad textarea behaviour
 const textPad = pad.querySelector('textarea');
 textPad.addEventListener('click',()=>{savedNote.style.visibility = 'hidden'; });
 // notepad edit behaviour
 const edit = pad.querySelector('.edit');
 edit.addEventListener('click', ()=>{selectedPad.readOnly = false;});
 //notepad modal count
 selectNotePad(pad.className);
}

//delete function for created notes and removes modalforms accordingly...................
function discardNotePad(n){
    const selectNote = n.parentNode.parentNode.parentElement;
    let index = [...selectNote.parentElement.children].indexOf(selectNote);
    padStorage.splice(index-1, 1)
    sessionStorage.setItem('notepad', JSON.stringify(padStorage));

    //modalform delete 
    const modIndex = n.parentNode.parentNode.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild;
    modalIndex.splice(index-1, 1);
    modIndex.remove();
    selectNote.remove();
    noteCount--;
    location.reload();

    console.log(modalIndex.length)
}

//storage for saved write-ups(texts).....................
let SavedShelf = sessionStorage.getItem('text')
?JSON.parse(sessionStorage.getItem('text')):[];
//storage for saved titles......................
let titles = sessionStorage.getItem('tit')
?JSON.parse(sessionStorage.getItem('tit')):[];

//position indexes for title, text values and DOM position
const editTitle = [];
const editText = [];
const editIndex =[];

// condition varible for saving data on selected note pads
let buttonEvent = 0;

buttonSave.addEventListener('click', saveCheck );

///save data function
function saveCheck(){
    buttonEvent+=1; // frequency measure
    saveData();
    buttonEvent-=1;
}
function saveData(x){
    let text = null;
   if(buttonEvent > 0){
    text = textNote.value;
   }else{
    let newPadText = x.parentElement.parentNode.nextElementSibling.firstElementChild.firstElementChild;
    text = newPadText.value;
    newPadText.value = '';
   }   
    let title = null;
    let list = document.createElement('li');
    if(editText.length >= 1 && editTitle.length >= 1){
        editTitle.splice(0, editTitle.length-1);
        editText.splice(0, editText.length-1);
        title = prompt('Note title', editTitle[0]);
        titles[editText[0]] = title;
        sessionStorage.setItem('tit', JSON.stringify(titles));
        SavedShelf[editText[0]] = text;
        sessionStorage.setItem('text', JSON.stringify(SavedShelf));
        textNote.value = "";
        alert('Do you want to Overwrite?');
        location.reload(); //reload to reprint the edit. no list.innerHTML
    }else{   
    title = prompt('Note title');
    list.style.width = '197px';
    list.style.lineHeight= '1.8';
    list.innerHTML = '<b onclick="editNote(this)">'+title+'</b>' +' || '+ '<i>'+text.slice(0,18)+'</i>'+'   <span onclick="discard(this)"><b>x</b></span>';
    savedNote.appendChild(list);
    SavedShelf.push(text);
    titles.push(title);
    sessionStorage.setItem('text', JSON.stringify(SavedShelf));
    sessionStorage.setItem('tit', JSON.stringify(titles));
    textNote.value = "";
};
}
//rerendering savednotes on refresh.....................
let theSavedNote = JSON.parse(sessionStorage.getItem('text'));
    for(let y in theSavedNote) {
        let list = document.createElement('li');
        list.style.backgroundColor = 'rgba(44, 122, 131, 0.15)';
        list.style.width = '197px';
        list.style.lineHeight= '1.8';
        list.style.color = 'rgb(25, 25, 20)';
        list.innerHTML = '<b onclick="editNote(this)">'+titles[y]+'</b>'+' || '+'<i>'+ theSavedNote[y].slice(0,18)+'</i>' +'   <span onclick="discard(this)"><b>x</b></span>' ;
        savedNote.appendChild(list);   
    };

// check saved texts
buttonSaved.addEventListener('click', checkNote);

function checkNote(){ 
    if(savedNote.children.length == 1){
        savedNote.style.visibility = 'hidden';
    }else
    if(savedNote.style.visibility === 'visible'){
        savedNote.style.visibility = 'hidden';
    }else{ savedNote.style.visibility = 'visible';}
    paddiv.style.visibility = 'hidden';
}

//delete saved texts
function discard(d){
let del = d.parentElement;
let delIndex = [...del.parentElement.children].indexOf(del);
SavedShelf.splice(delIndex-1,1);
titles.splice(delIndex-1,1);
sessionStorage.setItem('text', JSON.stringify(SavedShelf));
sessionStorage.setItem('tit', JSON.stringify(titles));
del.remove();
if(savedNote.children.length == 1){
    savedNote.style.visibility = 'hidden';
}else{
    console.log(savedNote.children.length-1)
}
}

//edit saved texts
function editNote(e){
    var editN = e.parentElement;
    var editIndex = [...editN.parentElement.children].indexOf(editN); //position
    var newEdit = JSON.parse(sessionStorage.getItem('text'));
    var titleEdit  = JSON.parse(sessionStorage.getItem('tit'));
    
    if(padStorage.length < 1){
        textNote.value = newEdit[editIndex-1];
        textNote.readOnly = true;
        editText.push(editIndex-1);
    }else{
        paddiv.style.visibility = 'visible';
        editText.push(editIndex-1);
    }
    
    editTitle.push(titleEdit[editIndex-1]);
    savedNote.style.visibility = 'hidden';
}

//box(modalform) selection for ready text editing
function pick(c){
    let whichModal = c.parentElement;
    let whichIndex = [...whichModal.parentElement.children].indexOf(whichModal);
    const selectNotePosition = [...whichModal.parentElement.parentNode.parentNode.firstElementChild.nextElementSibling.children][whichIndex+1];
    selectedPad = selectNotePosition.lastElementChild.firstElementChild.firstElementChild;
    selectedPad.value = SavedShelf[editText[editText.length-1]];
    selectedPad.readOnly = true;
    paddiv.style.visibility = 'hidden';
}    

//avaliable note pad selection
function selectNotePad(n){
    let modalForm = document.createElement('li');
    modalForm.style.listStyleType = 'none';
    modalForm.style.margin = '2px';
    modalForm.innerHTML = '<button onclick="pick(this)"> '+n+' </button>';
    padList.appendChild(modalForm);
    modalIndex.push(modalForm.innerHTML);
    //console.log(modalIndex)
}

// //console.log(document.body.firstElementChild.nextElementSibling);
//document.body.firstElementChild.nextElementSibling.nextElementSibling.appendChild(pad); 
