const { count } = require('console');
const { mkdirSync } = require('fs');

// var app = require('http').createServer();
// var io = require('socket.io')(app);
// var PORT = 5501;
// app.listen(PORT);

// Create server
const app = require('http').createServer();

const io = require('socket.io')(app,{
    cors: {
        origin: "http://192.168.1.109:5501",
        methods: ["GET", "POST"]
    }
});

// io.on('connection', (socket) => {
    
//     // First connection
//     console.log("socket.io connected"); // Not working
 
// });
  
// server.listen(5501, () => {
//     console.log("listen port: 5501"); // Working
// });
  
/*初始用戶陣列*/
let users = [];

let userscount = 0;
/*監聽連線*/
io.on('connection', function (socket) {

	/*是否是新用戶*/
	let isNewPerson = true; 
	/*當前登入用户*/
    let username = null;
	/*監聽登入*/
	socket.on('login',function(data){

		for(var i=0;i<users.length;i++){
	        if(users[i].username === data.username){
	          	isNewPerson = false;
	          	break;
	        }else{
	          	isNewPerson = true;
	        }
	    }
	    if(isNewPerson){
	        username = data.username
			
	        users.push({
	          username:data.username
	        })
			
			data.userscount  = users.length;
	        /*登入成功*/
	        socket.emit('loginSuccess',data);
			
	        /*向所有客戶端廣播add事件*/
			
	        io.sockets.emit('add',data, data.userscount);
					
	    }else{
	    	/*登入失敗*/
	        socket.emit('loginFail','');
	    }  
	})

	/*監聽發送消息*/
	socket.on('sendMessage',function(data){
        io.sockets.emit('receiveMessage',data);
    })


	/*斷線: 退出登入*/
	socket.on('disconnect',function(){

		/*向所有連接的客戶端廣播leave事件*/
      	io.sockets.emit('leave', username);
      	users.map(function(val,index){
			if(val.username === username){
				users.splice(index,1);

			}
		})


    })


})
// console.log('app listen at '+PORT);



