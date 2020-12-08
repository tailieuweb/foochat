const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	fullname: {
		type: String,
		default: "Not update",
	},
	email: {
		type: String,
		default: "und.user@email.com",
	},
	username: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	dateAdded: {
		type: Date,
		default: Date.now,
	},
	isOnline: {
		type: Boolean,
		default: false,
	},
	isBlock: {
		type: Boolean,
		default: false,
	},
	rule: {
		type: String,
		default: "user",
	},
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
