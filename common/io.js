let socket_io = require('socket.io')
let io = socket_io()
let socketAPI = {}
let userList = [{
    id: 0,
    username: "BKBot",
}]
let { Mess0, Mess1, Mess2, Mess3 } = ""
//Your socket logic here
socketAPI.io = io

io.on('connection', async (socket) => {
    console.log("connected!   id:", socket.id)
    // Event: new user registers and connects
    socket.on('signin', (username) => {
        userList.push({
            id: socket.id,
            username: username,
        })
        console.log(userList)
        // broadcast new user to everyone
        io.emit('new user', {
            id: socket.id,
            username: username
        })
        io.emit('updated list', userList)
        console.log(userList)

    })
    // Event: client disconnects with server
    socket.on('disconnect', function () {
        for (let i = 0; i < userList.length; i++) {
            if (userList[i].id == socket.id) {
                io.emit('disconnect user', userList[i])
                userList.splice(i)
                break
            }
        }
    })


    // Event: new user sends a message to server
    socket.on('message', function (data) {
        let { id, message, senderID, questionNum } = data

        console.log("message from: ", senderID, " to: ", id, " content:", message, "questionNum", questionNum)

        // if not a message to bot:
        if (id != 0) {
            for (let i = 0; i < userList.length; i++) {
                if (userList[i].id == id) {
                    io.to(id).emit('coming message', { message, senderID })
                    break
                }
            }
        }
        else {
            io.to(senderID).emit('coming message', { message: chatbot(message, questionNum,), senderID: 0, st: Mess0 })
        }
    })
})
// handle incoming message to chatbot
function chatbot(mess, questionNum) {
    let content = ""

    if (questionNum === 0) {
        content = chatbotSelection(mess)
        Mess0 = mess

    }
    if (questionNum === 1) {
        switch (Mess0) {
            case "A":
                content = WordCount(mess)
                break
            case "B":
                content = "let you enter a word which is found! "
                Mess1 = mess
                break
            case "C":
                content = "let you enter A and B which is convert A to B!"
                Mess1 = mess
                break
            case "D":
                content = "let you enter a number"
                Mess1 = mess
                break
            case "E":
                content = "let you enter a number"
                Mess1 = mess
                break
            default:
                content = "hello"

                break
        }

        return content
    }
    if (questionNum === 2) {
        switch (Mess0) {
            case "A":

                break
            case "B":
                content = FindingSomeWords(Mess1, mess)
                break
            case "C":
                console.log(Mess1 + " " + mess)
                content = ChangingaWord(Mess1, mess)
                break
            case "D":
                console.log(Mess1)
                content = encodingText(Mess1, mess)
                break
            case "E":
                console.log(Mess1)
                content = decodingText(Mess1, mess)
                break

            default:
                content = "hello"
                break
        }
        return content
    }


    return content
}

//
function chatbotSelection(mess) {
    let res = " "
    switch (mess) {
        case "A":
            res = "Word count in your text  "
            break
        case "B":
            res = "Finding word in your text"
            break
        case "C":
            res = "Changing a word in your text"
            break
        case "D":
            res = "encoding text"
            break
        case "E":
            res = "decoding text"
            break
        default:
            res = "Not available"
            break

    }
    return res

}

// Word Count in a Text function 
// @param: str : chuỗi nhập vào 
// @return: số từ trong chuỗi
function WordCount(str) {
    const temp = str.split(' ')
    let count = 0
    temp.forEach(el => {
        if (el !== '') count++
    })
    return `${count}`
}

// Find Word in a Text function
// @param: str: chuỗi nhập vào
// @param: word: từ cần tìm trong chuỗi
// @return: số từ trong chuỗi
function FindingSomeWords(str, word) {
    const DAU_CAU = '.,!?'
    let temp = str.split('')
    for(let i = 0; i < temp.length; i++) {
        if(DAU_CAU.includes(temp[i])) {
            temp.splice(i, 1)
            i--
        }
    }
    temp = temp.join('').split(' ')
    let res = 0
    temp.forEach(el => {
        if (el === word) res += 1
    })
    return `${res}`
}
// Replace Word in a Text function
// @param: str : chuỗi nhập vào
//         words: từ muốn thay trong chuỗi với cú pháp [từ_muốn_thay từ_thay]
// @return: chuỗi sau khi đã thay
function ChangingaWord(str, words) {
    const wordArr = words.split(' ')
    for(let i = 0; i < wordArr.length; i++) {
        if(wordArr[i] === '') {
            wordArr.splice(i, 1)
            i--
        }
    }
    if(wordArr.length !== 2) return 'Error'
    const src = str.split(' ')
    src.forEach((word, index) => {
        if(word === wordArr[0]) {
            src[index] = wordArr[1]
        }
    })
    return src.join(' ')
}

// encoding Text function
// @param: str: Chuỗi nhập vào
//          num: số bất kỳ từ 1-100
// @return: Text sau khi mã hóa
function encodingText(str, num) {
    if (num > str.length) {
        return str.split('').reverse().join('')
    } else {
        let temp = str.substring(num).split('').reverse().join('')
        return str.substring(0, num) + temp
    }
}

// decoding Text function
// @param: res: Chuỗi nhập vào
//         num: số bất kỳ từ 1-100
// @return: Text sau khi giải mã
function decodingText(str, num) {
    if (num > str.length) {
        return str.split('').reverse().join('')
    } else {
        let temp = str.substring(num).split('').reverse().join('')
        return str.substring(0, num) + temp
    }
}

io.on('disconnect', async (socket) => {
})

module.exports = {
    socketAPI,
    userList
}
