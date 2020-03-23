module.exports = class Room {
    constructor(io, roomCode) {
        this.roomCode = roomCode;
        this.userList = []; //3명까지 가능

        this.nsp = io.of(`/${roomCode}`);

    }

    _connect(userName) {
        const exNsp = this.nsp;
        this.userList.push(userName);
        exNsp.on('connect',(socket)=>{
            exNsp.emit('userList',this.userList);
        })

        if (this.userList.length === 3) {
            setTimeout(() => {
                this._moveToChatRoom();
            }, 3000);
        }
    }

    _disconnect(userName){
        const idx = this.userList.indexOf(userName);
        if(idx>-1) this.userList.splice(idx,1);

        return this.userList.length;
    }

    _moveToChatRoom() {
        this.nsp.emit('matched', {roomCode:this.roomCode });
    }

    _deleteRoom() {
        return this.roomCode;
    }   

}