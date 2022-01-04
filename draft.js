const str = 'anh     day      ma'

const arr = str.split(' ')
console.log(arr)

for (let i = 0; i < arr.length; i++) {
    if(arr[i] === '') {
        arr.splice(i, 1)
        i--
    }
}

console.log(arr.join(' '))
