const wait = (ms) => {
	const startPoint = new Date().getTime();
	while (new Date().getTime() - startPoint <= ms) {
		/* wait */
	}
};
export default wait;
