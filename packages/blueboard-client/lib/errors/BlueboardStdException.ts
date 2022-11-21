// Standard exception
class BlueboardStdException extends Error {
    public type?: string;
    public origErr?: any;

    constructor(message: string, type?: string, origErr?: any) {
        super(message);
        this.type = type;
        this.origErr = origErr;
    }
}

export default BlueboardStdException;
