$(document).ready(function () {
    let socket = io();
    socket.emit('signin', username);
    let selectedUserID = 0;
    let userList = null;
    let quesNum=0;
    
    function addNewContact(user) {
        if (user.id == socket.id) {
            console.log('same id')
            return;
        }
        $('#contacts').append(`
            <li class="list-group-item-action" id = "contact-${user.id}">
                <div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="/public/img/avatar.jpg" class="rounded-circle user_img">
                        <span class="online_icon"></span>
                    </div>
                    <div class="user_info">
                        <span>${user.username}</span>
                        <p>${user.username} is online</p>
                    </div>
                </div>
            </li>
        `)
    }

    function disconnectContact(user) {
        let contact = $(`#contact-${user.id}`)
        if (contact)
            contact.remove();
    }

    function getUserByID(id) {
        if (userList === null || userList === undefined) {
            console.log("userList null hoac undefined")
            return null;
        } else {
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].id == id) {
                    console.log(userList[i].username);
                    return userList[i].username;
                }
            }
        }
    }
    $(document).bind('keypress', function(e) {
        if(e.keyCode==13){
             $('#send-btn').trigger('click');
         }
    });

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ampm;
        return strTime;
    }
    // button, page events
    // on send message button
    $('#send-btn').click(function (e) {

        // messsage
        $('#message-body').animate({ scrollTop: $('#message-body').get(0).scrollHeight }, 800);
        let message = $('#message-txt').val();
        $('#message-txt').val('');
        if (message) {
            $('#message-body').append(`
            <div class="d-flex justify-content-end mb-4">
                <div class="msg_cotainer_send">
                    ${message}
                    <span class="msg_time_send"> ${formatAMPM(new Date)}</span>
                </div>
                <div class="img_cont_msg">
                    <img src="/public/img/avatar.jpg" class="rounded-circle user_img_msg">
                </div>
            </div>
            `)
        }
        // send message
        socket.emit('message', { message, id: selectedUserID, senderID: socket.id,questionNum:quesNum })
        
    })
    $('#whoOnline').append(`
    <span class="mt-3 text-capitalize text-white font-weight-bold h4"> ${username} 
    <img class ="check-mark rounded-circle" src="/public/img/check.png"/> 
    </span>  `);
        
    // on contact selected button
    $(document).on('click', '[id^=contact-]', function (e) {
        let obj = $(e.target).closest('li')[0]
        let getUserNameBoxChat;

        selectedUserID = obj.id.slice(8);
        $('#message-body').empty();
        $(`li`).not(`#contact-${selectedUserID}`).removeClass('active')
        $(`#contact-${selectedUserID}`).addClass('active')

        if (selectedUserID == 0) {
            $('#message-body').append(`
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg">
                        <img src="/public/img/avatar.jpg" class="rounded-circle user_img_msg">
                    </div>
                    <div class="msg_cotainer">
                        Hi, how are you ${username}?
                        <ul>
                                <li>A: Count Word In Your Text</li>
                                <li>B: Find A Word In Your Text</li>
                                <li>C: Replace A Word In Your Text</li>
                                <li>D: Encode the Text</li>
                                <li>E: Decode the Text</li>
                        </ul>
                        <span class="msg_time"> ${formatAMPM(new Date)}</span>
                    </div>
                </div>
            `)

            
        }
        
            

        if (selectedUserID == 0) {
            $('#insertUserNameBoxChat').empty();
            
            $('#insertUserNameBoxChat').append(`<span id="${selectedUserID}">Chat with BKBot</span>`)
        } else {
            getUserNameBoxChat = getUserByID(selectedUserID);
            $('#insertUserNameBoxChat').empty();
            
            $('#insertUserNameBoxChat').append(`<span id="${selectedUserID}">Chat with ${getUserNameBoxChat}</span>`)
        }

        
    })

    // socket io logics
    socket.on('new user', user => {
        addNewContact(user)
    })

    socket.on('updated list', updatedUserList => {
        userList = updatedUserList;
        getUserByID(userList);
    })

    socket.on('disconnect user', user => {
        disconnectContact(user)
    })

    socket.on('coming message', data => {
        let { message, senderID, st } = data;
        console.log(message)
       
        if(message === "Not available"){
            quesNum=0
        }
        else{
            quesNum++
        }
        console.log(quesNum)
        
        
    if( quesNum === 2 && st ==="A"){
          quesNum=0
    }
    if(quesNum ===3){
          quesNum=0
    }
        

        if (message) {
            if ($(`#contact-${senderID}`).hasClass('active')) {
                $('#message-body').animate({ scrollTop: $('#message-body').get(0).scrollHeight }, 800);
                $('#message-body').append(`
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg">
                        <img src="/public/img/avatar.jpg" class="rounded-circle user_img_msg">
                    </div>
                    <div class="msg_cotainer">
                        ${message}
                        <span class="msg_time">${formatAMPM(new Date)}</span>
                    </div>
                </div>
                `)
            }
            else {
                selectedUserID = senderID;
                $('#message-body').empty();
                $('#message-body').animate({ scrollTop: $('#message-body').get(0).scrollHeight }, 800);
                $(`li`).not(`#contact-${senderID}`).removeClass('active')
                $(`#contact-${senderID}`).addClass('active')
                $('#message-body').append(`
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg">
                        <img src="/public/img/avatar.jpg" class="rounded-circle user_img_msg">
                    </div>
                    <div class="msg_cotainer">
                        ${message}
                        <span class="msg_time">${formatAMPM(new Date)}</span>
                    </div>
                </div>
                `)

            }
        }
    })
});