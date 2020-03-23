const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const mainField = document.getElementById('main-field');
const loadingField = document.getElementById('loading-field');
const nameInput = document.getElementById('name');
const list = document.getElementById('user-list');
let name = '';
let socket = null;
let roomCode = '';


startBtn.addEventListener('click', () => {
    name = nameInput.value;
    nameInput.value = '';
    mainField.style.display = 'none';
    loadingField.style.display = 'block';

    startMatching(name, (code) => {
        socket = io(`/${code}`, { transports: ['polling'] });
        socket.on('connect', () => {
            console.log('move new namespcae',code);
            socket.emit('enter', `${name}가 방:${code}에 들어왔습니다.`);

            socket.on('userList', (userList) => {//방에 누구있는지 체크
                list.innerHTML = null;
                userList.forEach(user=>{
                    var li = document.createElement('li');
                    li.textContent = user;
                    list.appendChild(li);
                })
            })

            socket.on('matched',({roomCode})=>{
                window.location.href = `/chat/${roomCode}/${name}`;
            })
        });

    });
})

stopBtn.addEventListener('click', () => {
    nameInput.value = name;
    mainField.style.display = 'block';
    loadingField.style.display = 'none';

    stopMatching();
})

function startMatching(name, cb) {
    socket = io('/main', { transports: ['polling'] });
    socket.on('connect', () => {
        socket.emit('userName', name);
        console.log('connecting..');
        socket.on('roomCode', (code) => {
            roomCode = code;
            console.log('roomCode is ',roomCode);
            socket.disconnect();
            cb(roomCode);
        })
    });
    socket.on('error', (error) => {
        console.log('Socket Error: ', error);
    })
}

function stopMatching() {
    socket.disconnect();
}

