require('../src/db/mongoose');

const Task = require('../src/models/task');

// Task.findByIdAndDelete('631216544241786975ad5771').then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    const deletedtask = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('6310c50e0b9426a7040a8b97').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})