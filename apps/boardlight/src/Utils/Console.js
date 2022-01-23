class BoardlightConsole {
    get msg() {
        console.log('hello world!');
    }
}

const register = () => {
    window.blc = new BoardlightConsole();
};

export default register;
