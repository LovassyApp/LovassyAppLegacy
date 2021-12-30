const getCallerName = (caller) => {
	if (caller == undefined) {
		return 'anonymus';
	}
	return caller.name ?? 'anonymus';
};

const log = (msg, caller, css) => {
	console.log('%cCaller: ' + getCallerName(caller) + '\n%c' + msg, 'background: black; color: whitesmoke;', css);
};

const success = (msg, caller) => {
	log(msg, caller, 'color: lime;');
};

export { success };
