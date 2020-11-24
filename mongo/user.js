
// lien ket de luu du lieu vao mongo theo duong dan phi duoi
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/chat", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
      console.log("Error : " + err);
    }
    else {
      console.log("Connected successfully");
    }
  }
);


// khoi tao Schema bao gom cac field và mac dinnh kieu du lieu truyen vao

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    password: {
        type: String,
        require: true
    },

    createAt: {
        type: Number,
        default: Date.now
    },
    updateAt: {
        type: Number,
        default: null
    },
    deleteAt: {
        type: Number,
        default: null
    }
}, {
    collection: 'user'
});
// gan tri so vao UserModal va se luu cac field vào collection co ten la user
const UserModel = mongoose.model('user', UserSchema);

//// test cau truy van du lieu

// tao mot user 

UserModel.create({
    username: "ngongocdien",
    gender: "female",
    password:"123456",
})
.then(data =>    console.log("Data", data))
.catch(err => console.log(err))


// xoa 1 user theo user name
// UserModel.deleteOne({username: "hokhaclinh"}, err => {
//     if(err) console.log("Error", err);
//     else {
//         console.log('OK');
//     }
// })

// cap nhat thong tin theo ten

// UserModel.updateOne({
//     username: "hokhaclinh"
// }, {
//     username: "holinh",
//      gender: "female",
// }, err => {
//     if (err) {
//         res.json({
//             error: 0,
//             msg: err
//         })
//     } else {
//        console.log("OKKKK");
//     }
// })

// lay tat ca thong tin user co trong mongo
UserModel.find().then(data => console.log(data))

module.exports = UserModel;