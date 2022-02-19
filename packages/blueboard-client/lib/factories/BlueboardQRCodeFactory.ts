import BlueboardQRCode from "../models/BlueboardQRCode";
import BlueboardTimestamps from "../models/BlueboardTimestamps";
import BlueboardQRCodePivot from "../models/BlueboardQRCodePivot";
import { checkIterable } from "../BlueboardClientUtils";

class BlueboardQRCodeFactory {
    static getResponse(obj: any) {
        const data: Array<BlueboardQRCode> = [];

        //Note: this may break once there's an option to only get a single code
        if (checkIterable(obj)) {
            for (const code of obj) {
                data.push(BlueboardQRCodeFactory.getQRCode(code));
            }
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
            obj.email,
            new BlueboardQRCodePivot(obj.pivot?.product_id, obj.pivot?.code_id)
        );
    }
}

export default BlueboardQRCodeFactory;
