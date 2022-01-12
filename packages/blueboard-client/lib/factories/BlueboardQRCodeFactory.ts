import BlueboardQRCode from "../models/BlueboardQRCode";
import BlueboardTimestamps from "../models/BlueboardTimestamps";
import BlueboardQRCodePivot from "../models/BlueboardQRCodePivot";

class BlueboardQRCodeFactory {
    static getResponse(obj: any) {
        const data: Array<BlueboardQRCode> = [];

        //Note: this may breakk once there's an option to only get a single code
        for (const code of obj) {
            data.push(BlueboardQRCodeFactory.getQRCode(code));
        }

        return data;
    }

    static getQRCode(obj: any) {
        return new BlueboardQRCode(
            obj.id,
            new BlueboardTimestamps(obj.created_at, obj.updated_at),
            obj.secret,
            obj.name,
            obj.image,
            new BlueboardQRCodePivot(obj.pivot?.product_id, obj.pivot?.code_id)
        );
    }
}

export default BlueboardQRCodeFactory;
