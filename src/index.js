const express = require('express');
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT || 9000

// app.use((req, res, next) => {
   
//     next()
// })

app.use(express.json())
//both works
// app.use(userRouter, taskRouter)
// app.use([userRouter, taskRouter])
app.use(userRouter)
app.use(taskRouter)



app.listen(port, () => {
    console.log('server is up on port ' + port )
})


