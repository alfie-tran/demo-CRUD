const controller = {};
const models = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

controller.show = async (req, res) => {
	let keyword = req.query.keyword ? req.query.keyword.trim() : '';
	let options = {
		attributes: ['id', 'imagePath', 'username', 'firstName', 'lastName', 'mobile', 'isAdmin'],
		order: [['createdAt', 'DESC']],
	};
	if (keyword != '') {
		options.where = {
			[Op.or]: {
				firstName: { [Op.iLike]: `%${keyword}%` },
				lastName: { [Op.iLike]: `%${keyword}%` },
				username: { [Op.iLike]: `%${keyword}%` },
			},
		};
	}

	let page = isNaN(req.query.page) ? 1 : parseInt(req.query.page);
	let limit = 2;
	let offset = (page - 1) * limit;
	let users = await models.User.findAll(options);

	res.locals.pagination = {
		page,
		limit,
		totalRows: users.length,
		queryParams: req.query,
	};
	res.locals.users = users.slice(offset, offset + limit);
	res.render('user-management');
};

controller.add = async (req, res) => {
	let { firstName, lastName, username, mobile, isAdmin } = req.body;
	try {
		await models.User.create({
			firstName,
			lastName,
			username,
			mobile,
			isAdmin: isAdmin ? true : false,
		});
		res.status(200).send('User created!');
	} catch (error) {
		console.error(error);
		res.status(400).send('Can not add new user!');
	}
};

controller.update = async (req, res) => {
	let id = isNaN(req.body.id) ? 0 : parseInt(req.body.id);
	let { firstName, lastName, mobile, isAdmin } = req.body;
	try {
		await models.User.update(
			{
				firstName,
				lastName,
				mobile,
				isAdmin: isAdmin ? true : false,
			},
			{
				where: {
					id,
				},
			},
		);
		res.status(200).send('User has been updated!');
	} catch (err) {
		console.error(err);
		res.status(400).send('Can not update user!');
	}
};
controller.delete = async (req, res) => {
	let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
	// let id = 'a';
	try {
		await models.User.destroy({
			where: { id },
		});
		res.status(200).send('User has been deleted!');
	} catch (err) {
		console.error(err);
		res.status(400).send('Can not delete user!');
	}
};
module.exports = controller;
