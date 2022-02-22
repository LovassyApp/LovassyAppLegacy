class BoardlightConsole {
    public get msg(): string {
        console.log("hello world!");
        return "";
    }
}

declare global {
    interface Window {
        blc: BoardlightConsole;
    }
}

const register = (): void => {
    window.blc = new BoardlightConsole();
};

export default register;
