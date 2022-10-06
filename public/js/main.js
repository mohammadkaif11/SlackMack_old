const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const blodclick = document.getElementById('btn-clickforbold')
const italianclick = document.getElementById('btn-clickforitalian')
const linkclick = document.getElementById('btn-clickforlink');
const sendolList = document.getElementById('btn-sendollist')
const sendliList = document.getElementById('btn-sendlilist')
const sendcode = document.getElementById('btn-sendcode')
const sendfile = document.getElementById('sendfile')
const sendfilebtn = document.getElementById('btn-sendfile')
const clickformention=document.getElementById('btn-clickformention');
var array=[];
const strikethrough = document.getElementById('btn-strikethrough')

var textarea = document.getElementById("msg");
textarea.innerText="";

var BlockCode = 0;
var IsStrikethrough = false;
var ListCount = 1;
var OlListSend = false;
var LiListSend = false;
var IsLink = false;
var IsItalian = false;
var Isblod = false;
var IsCode = false;

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

console.log({ username, room })

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('sendfile' ,(file)=>{
console.log(file)
})

//button  send file click
sendfilebtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("send file buttion click");
    sendfile.click();
})

//button for mention
clickformention.addEventListener('click', (e) => {
    e.preventDefault();
    var msg = document.getElementById('msg');
    console.log("mention button call");
    console.log(array)
})

//button for upload
function upload(files) {
    socket.emit("upload", files[0], (status) => {
        console.log(status);
    });
}

//button send unorderlist
sendolList.addEventListener('click', (e) => {
    e.preventDefault();
    if (OlListSend) {
        OlListSend=false;
        BlockCode=0;
         return
         }
    if (BlockCode != 1) {
        var tempstring = ""
        OlListSend = true;
        textarea.innerText = tempstring;
        BlockCode = 1;
    }
    else {
        alert("At time we can choose only One Option");
    }
})


//button send orderlist
sendliList.addEventListener('click', (e) => {
    e.preventDefault();
    if (LiListSend) { 
        var msg = document.getElementById('msg');
        LiListSend=false;
        BlockCode=0;
        textarea.innerText = "";
        console.log("inner text")
        return ;
    }
    if (BlockCode != 1) {
        var msg = document.getElementById('msg');
        var tempstring = "1."
        LiListSend = true;
        textarea.innerText = tempstring;
        BlockCode = 1;
    }
    else {
        alert("At time we can choose only One Option");
    }
})


// Execute a function when the user presses a key on the keyboard
textarea.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter" && OlListSend == true) {
        var textarea_change = document.getElementById("msg");
        event.preventDefault();
        var tempstring = textarea_change.value + '\n';
        textarea_change.value = tempstring;
        console.log(tempstring)
    }
    if (event.key === "Enter" && LiListSend == true) {
        var textarea_change = document.getElementById("msg");
        event.preventDefault();
        ListCount++;
        var tempstring = textarea_change.value + '\n' + ListCount + '.';
        textarea_change.value = tempstring;
    }
});


//button function
//strike throught
strikethrough.addEventListener('click', (e) => {
    e.preventDefault();
    if (IsStrikethrough)
     { 
        IsStrikethrough=false;
        BlockCode=0;
        var msg = document.getElementById('msg');
        msg.style.textDecoration = 'none';
        return;
     }
    if (BlockCode != 1) {
        IsStrikethrough = true;
        var msg = document.getElementById('msg');
        msg.style.textDecoration = 'line-through';
        BlockCode = 1;
    }
    else {
        alert("At time we can choose only One Option");
    }
})

//send bold
blodclick.addEventListener('click', (e) => {
    if (Isblod) {
        Isblod=false;
        BlockCode=0;
        var msg = document.getElementById('msg');
        msg.style.fontWeight = 'normal';
        return;
    }
    e.preventDefault();
    if (BlockCode != 1) {
        var msg = document.getElementById('msg');
        msg.style.fontWeight = 'bold';
        Isblod = true;
        BlockCode = 1;
    }
    else {
        alert("At time we can choose only One Option");
    }
})

//senditalic
italianclick.addEventListener('click', (e) => {
    e.preventDefault();
    if (IsItalian) {
        BlockCode = 0;
        IsItalian = false;
        var msg = document.getElementById('msg');
        msg.style.fontStyle = 'normal'

        return;
    }
    if (BlockCode != 1) {
        var msg = document.getElementById('msg');
        msg.style.fontStyle = 'italic'
        IsItalian = true;
        BlockCode = 1;
    } else {
        alert("At time we can choose only One Option");
    }
})

//sendLink
linkclick.addEventListener('click', (e) => {
    e.preventDefault();
    if (IsLink) {
        var msgelment = document.getElementById('msg');
        IsLink = false;
        BlockCode = 0;
        msgelment.style.color = 'gray';
        return;
    }
    if (BlockCode != 1) {
        var msgelment = document.getElementById('msg');
        IsLink = true;
        BlockCode = 1;
        msgelment.style.color = 'blue';
    } else {
        alert("At time we can choose only One Option");
    }
})

//sendCode
sendcode.addEventListener('click', (e) => {
    e.preventDefault();
    if (IsCode != 1) {
        var msgelment = document.getElementById('msg');
        IsCode = true;
        BlockCode = 1;
        msgelment.style.color = 'green';
        msgelment.style.backgroundColor='orange';
        msgelment.style.fontStyle='Consolas'
    } else {
        alert("At time we can choose only One Option");
    }
})


// Message submit
chatForm.addEventListener('submit', (e) => {
    var msgelment = document.getElementById('msg');
    e.preventDefault();
    // Get message text
    var msg = e.target.elements.msg.value;
    msg = msg.trim();
    if (!msg) {
        return false;
    }
    if (Isblod && BlockCode == 1) {
        Isblod = false;
        msgelment.style.fontWeight = 'normal';
        msg = "*" + msg;
        BlockCode = 0;
    }
    if (IsItalian && BlockCode == 1) {
        IsItalian = false;
        msgelment.style.fontStyle = 'normal';
        msg = "/ " + msg;
        BlockCode = 0;
    }
    if (IsLink && BlockCode == 1) {
        IsLink = false;
        msgelment.style.color = 'gray';
        msg = "`" + msg;
        BlockCode = 0;
    }
    if (IsStrikethrough && BlockCode == 1) {
        IsLink = false;
        msgelment.style.textDecoration = 'none';
        msg = "$" + msg;
        BlockCode = 0;
    }
    if (OlListSend && BlockCode == 1) {
        OlListSend = false;
        msg = "@" + msg + '\n';
        BlockCode = 0;
    }
    if (IsCode && BlockCode == 1) {
        IsCode = false;
        msg = "^" + msg ;
        BlockCode = 0;
    }
    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});



// Output message to DOM
function outputMessage(message) {
    var IsLinkMsg = false;
    var NumricList = false;
    var IsCodeSend=false;
1
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');

    var subtemp = "";
    var MsgValue = message.text;
    for (var i = 0; i < message.text.length; i++) {
        if (message.text[i] == '*') {
            MsgValue =MsgValue.substring(1,MsgValue.length);
            para.style.fontWeight = 'bold';
            subtemp =MsgValue
        }
        if (message.text[i] == '/') {
            MsgValue =MsgValue.substring(1,MsgValue.length);
            para.style.fontStyle = 'italic';
            subtemp =MsgValue
        }
        if (message.text[i] == '`') {
            MsgValue =MsgValue.substring(1,MsgValue.length);
            subtemp =MsgValue
            IsLinkMsg = true;
            break;
        }
        if (message.text[i] == '$') {
            MsgValue =MsgValue.substring(1,MsgValue.length);
            subtemp =MsgValue
            para.style.textDecoration = 'line-through';
        }
        if (message.text[i] == '@') {
            MsgValue =MsgValue.substring(1,MsgValue.length);
            subtemp =MsgValue
            NumricList = true;
        }
        if (message.text[i] == '^') {
            MsgValue =MsgValue.substring(1,MsgValue.length);
            subtemp =MsgValue
            IsCodeSend=true;
        }
    }

    if (NumricList) {
        var createulElement = document.createElement('ul');
        var tempstring = "";
        for (var j = 0; j < subtemp.length; j++) {
            if (subtemp[j] == '\n') {
                var li = document.createElement('li');
                li.innerText = tempstring;
                createulElement.appendChild(li);
                tempstring = "";
            }
            tempstring += subtemp[j];
        }
        console.log("found ul element2")
        console.log(createulElement)
    }

    if (IsLink == false && NumricList == false && IsCodeSend==false) {
        para.innerText = subtemp.length == 0 ? message.text : subtemp;
    }
    if (IsLinkMsg) {
        var link = document.createElement('a');
        link.href = subtemp;
        link.innerText = subtemp;
    }
    if(IsCodeSend){
        var divcontent=document.createElement('div');
        divcontent.innerText=subtemp;
        divcontent.style.color='gray';
        divcontent.style.backgroundColor='black';
        divcontent.style.fontStyle="Consolas";
    }
    if (IsLinkMsg) {
        div.appendChild(link);
        IsLink = false
    }
    else if (NumricList) {
        div.appendChild(createulElement);
        NumricList = false;
    }else if(IsCodeSend){
        div.appendChild(divcontent);
        IsCodeSend=false;
    }
    else {
        div.appendChild(para);
    }
    document.querySelector('.chat-messages').appendChild(div);
}

function RetrunTrimString(data) {
    var changeData = substring(1, data.length - 1)
    return changeData;
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    console.log({ users })
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        array.push(username);
        userList.appendChild(li);
    });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});

