const User = require("../models/User");
exports.getListUser = async (req, res) => {
	const result = await User.find({})
		.lean()
		.catch((err) => {
			res.status(500).json({ message: "Can not search all user" });
		});
	console.log(result);
	return res.status(200).json({ result: result });
};

exports.updateUser = async (req, res) => {
	const { id, fullname, email } = req.body;
	console.log(id);
	const result = await User.findByIdAndUpdate(
		{
			_id: id,
		},
		{
			$set: { fullname: fullname, email: email },
		},
		{
			useFindAndModify: false,
		}
	).catch((err) => {
		res.status(404).json({ message: "Can not update user" });
	});
	return res.status(200).json({ result: result });
};

exports.deleteUser = async (req, res) => {
	const { id } = req.body;
	const result = await User.findByIdAndDelete(id).catch((err) => {
		return res.status(404).json({ message: "Can not delete this user" });
	});
	return res.status(200).json({ result: result });
};

exports.getUser = async (req, res) => {
	const { id } = req.body;
	await User.findOne({ _id: id })
		.then((result) => {
			return res.status(200).json({ result: result });
		})
		.catch((err) => {
			return res.status(404).json({ message: "Can not find this user" });
		});
};

// block user
exports.block_chat = async (req, res) => {
	const { id } = req.body;
	console.log('Request block:');
	console.log(id);
	await User.findByIdAndUpdate(
		{ _id: id },
		{
			$set: {
				isBlock: true,
			},
		},
		{ useFindAndModify: false }
	)
		.then((result) => {
			return res.status(200).json({ result: result });
		})
		.catch((err) => {
			console.log(err);
			return res.status(404).json({ message: "Can not block this user" });
		});
};
