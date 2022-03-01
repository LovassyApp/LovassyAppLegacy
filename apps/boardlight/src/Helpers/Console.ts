/* eslint-disable quotes */
/* eslint-disable prefer-template */
class BoardlightConsole {
    public get msg(): string {
        console.log('hello world!');
        return '';
    }

    public motd = (): void => {
        let str = '';
        const lineBreak = (): void => {
            str += '\n';
        };

        const line = (lineContent: string): void => {
            str += lineContent + '\n';
        };

        line('.---.                      .-..-.   _       .-.   .-. ');
        line(": .; :                     : :: :  :_;      : :  .' `.");
        line(":   .' .--.  .--.  .--.  .-' :: :  .-. .--. : `-.`. .'");
        line(": .; :' .; :' .; ; : ..'' .; :: :_ : :' .; :: .. :: : ");
        line(":___.'`.__.'`.__,_;:_;  `.__.'`.__;:_;`._. ;:_;:_;:_; ");
        line('                                       .-. :          ');
        line("                                       `._.'          ");
        lineBreak();
        line('Kópérájt minigyima, Xeretis 2021-2022.');
        lineBreak();
        line('Óll rájtsz rizörvd. Meg a fenét.');
        lineBreak();
        line('BTW: Ha ezt látod, ajánlom figyelmedbe: https://github.com/LovassyApp/LovassyApp');

        console.log(str);
    };
}

declare global {
    interface Window {
        blc: BoardlightConsole;
    }
}

const register = (): void => {
    window.blc = new BoardlightConsole();
    window.blc.motd();
};

export default register;
