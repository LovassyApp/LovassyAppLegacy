const register = () => {
	window.tell = tell;
};

const tell = (msg) => {
	console.log('NEM: ' + String(msg));
};

export default register;
