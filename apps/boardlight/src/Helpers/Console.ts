class BoardlightConsole {
    get msg() {
        console.log('hello world!');
        return '';
    }
}

declare global {
    interface Window {
        blc: BoardlightConsole;
    }
}

const register = () => {
    window.blc = new BoardlightConsole();
};

export default register;
