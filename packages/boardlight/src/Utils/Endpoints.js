let Endpoints = {
	base: process.env.REACT_APP_BLUEBOARD_URL + '/api',
	login: '/login',
	logout: '/logout',
	control: '/control',
	loloBase: '/lolo',
	kreta: {
		base: '/kreta',
		grades: '/kreta/grades',
	},
	permissions: {
		groups: '/permissions/groups',
		list: '/permissions/list',
	},
	users: '/users',
	qrcodes: '/qrcodes',
	products: '/products',
	socketAuth: '/broadcasting/auth',
};

export default Endpoints;
