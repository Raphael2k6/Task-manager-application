require('../src/db/mongoose');

const User = require('../src/models/user');

// User.findByIdAndUpdate("631210e6024d6e564a3e0795", {age: 3}).then((user) => {
//     console.log(user)
//     return User.countDocuments({age: 3})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateUserAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count;
}

updateUserAndCount('6310c377790ff9eab8f361dc', 6).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})