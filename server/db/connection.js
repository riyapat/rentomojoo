const mongoose = require('mongoose');
const db=`mongodb+srv://user:Riya2002@cluster0.3qbpnjr.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology : true

}).then(() => {
    console.log('database connected successfullly');
}).catch((e) =>{
    console.log(e, '<=error');
})