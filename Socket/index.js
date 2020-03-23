const room = require('./room');



/* return length-7 ramdom string */
function RandomString() {
    return Math.random().toString(36).substring(6);
}

/* make new room (namespace) */
function makeNewRoom(io, namespace, userName) {
    const newRoom = new room(io, namespace);
    newRoom._connect(userName);
    return newRoom;
}

/*  */
function connectSocket(userList,socket,roomCode, cb) {
    socket.on('userName', (name) => {
        console.log('New client : ', name);
        userList.push(name);        // 2

        socket.emit('roomCode', roomCode);
        cb(userList.length, roomCode,name);
    })
}
const RoomManager = (IO) => {
    const userList = [];
    const roomList = {};
    //기본 namespace 은 /main
    const nsp = IO.of('/main');
    let roomCode = RandomString();

    nsp.on('connect', (socket) => {

        /* 

        1. 사용자가 메칭시작을 누르면 연결됨
        2. 사용자를 추가
        2-1. 사용자가 1명일때는 방을 만듬
        2-2. 사용자가 2명일때는 위에서 만든 방에 넣고
        2-3. 사용자가 3명일때는 매칭완료후 채팅방으로보냄 
        3. 사용자리스트에서 지운다.       

        */
        connectSocket(userList,socket,roomCode, (num, _roomCode,userName) => {

            console.log('메인방 메칭시작.. 방 코드 : ', _roomCode);
            console.log('user-list : ',userList,userList.length);
            if (num % 3 === 1) {            // 2-1

                roomList[_roomCode] = makeNewRoom(IO,_roomCode,userName);

            } else if (num % 3 === 2) {     // 2-2

                roomList[_roomCode]._connect(userName);

            } else if (num % 3 == 0) {      // 2-3

                roomList[_roomCode]._connect(userName);

                console.log('매칭완료 .', userList[0], userList[1], userList[2], `방${_roomCode}로 이동.`);
                roomCode = RandomString();
                userList.splice(0, 3);
            }
        })
    })
}

module.exports = RoomManager;