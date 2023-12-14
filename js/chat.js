$(function(){
	/*建立socket連接，使用websocket，端口號是服務端監聽端口號*/
	// var socket = io('ws://192.168.1.109:5501');
	var socket = io('ws://localhost:5501');
	
	/*我的名字*/
	var myName = null;
	
	/*輸入名字 按登入*/
	$('.login-btn').click(function(){
		myName = $.trim($('#loginName').val());
		if(myName){
			/*向服務端發送登入事件*/
			/*把我的名字傳入username*/
			socket.emit('login',{username: myName})
		}else{
			alert('Enter your name !')
		}
	})

	/*登入成功*/
	socket.on('loginSuccess',function(data){
		if(data.username === myName){
			checkin()
		}else{
			alert('Wrong! Try again!')
		}
		
	})

	/*隱藏登入介面 顯示聊天介面*/
	function checkin(){
		$('.login-wrap').hide('slow');
		$('.chat-wrap').show('slow');		
	}
	
	/*登入失敗 重複名字提示訊息*/
	socket.on('loginFail',function(){
		alert('Already exist ! Try another name !')
	})

	/*傳送訊息 按鍵*/
	$('.sendBtn').click(function(){
		sendMessage()
	});
	$(document).keydown(function(event){
		if(event.keyCode == 13){
			sendMessage()
		}
	})

	/*傳送訊息 輸入框*/
	function sendMessage(){
		var txt = $('#sendtxt').val();
		$('#sendtxt').val('');
		if(txt){
			socket.emit('sendMessage',{username:myName,message:txt});
		}
	}

	/*接收訊息*/
	socket.on('receiveMessage',function(data){
		showMessage(data)
	})

	/*顯示訊息 右:我 左:其他使用者*/
	function showMessage(data){
		var html
		if(data.username === myName){
			html = '<div class="chat-item item-right clearfix"><span class="img fr"></span><span class="message fr">'+data.message+'</span></div>'
		}else{
			html='<div class="chat-item item-left clearfix rela"><span class="abs uname">'+data.username+'</span><span class="img fl"></span><span class="fl message">'+data.message+'</span></div>'
		}
		$('.chat-con').append(html);
	}

	
	/*新人加入提示0*/
	socket.on('add',function(data){
		var html = '<p>'+ data.username +' joined.</p>';
		$('.chat-con').append(html);
		document.getElementById('chat-title').innerHTML = ` 在線人數: ${ 0 }`;
		document.getElementById('chat-title2').innerHTML = `  ( login as : ${myName} )`;
	})

	socket.on('counting', function(){
		document.getElementById('chat-title').innerHTML = ` 在線人數: ${ 0 }`;
		
	})

	/*退出群聊提示ok*/
	socket.on('leave',function(username){
		if(username != null){
			var html = '<p> '+ username+' left. </p>';
			$('.chat-con').append(html);
		}
	})

})

