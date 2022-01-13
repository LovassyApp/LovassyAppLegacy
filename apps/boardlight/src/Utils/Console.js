class BoardlightConsole {
	get msg() {
		console.log('hello world!');
	}
}

const register = () => {
	//window.tell = tell;
	window.blc = new BoardlightConsole();
};

const tell = (msg) => {
	console.log('NEM: ' + String(msg));
};

export default register;
