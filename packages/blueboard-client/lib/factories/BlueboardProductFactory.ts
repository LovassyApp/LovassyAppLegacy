import BlueboardProduct from "../models/BlueboardProduct";
import BlueboardTimestamps from "../models/BlueboardTimestamps";
import BlueboardProductInput from "../models/BlueboardProductInput";
import BlueboardQRCode from "../models/BlueboardQRCode";
import BlueboardQRCodeFactory from "./BlueboardQRCodeFactory";

class BlueboardProductFactory {
    static getResponse(obj: any) {
        const data: Array<BlueboardProduct> = [];

        if (Array.isArray(obj)) {
            for (const product of obj) {
                data.push(BlueboardProductFactory.getProduct(product));
            }
        } else {
            data.push(BlueboardProductFactory.getProduct(obj));
        }

        return data;
    }

    static getProduct(obj: any) {
        const id = obj.id;
        const timestamps = new BlueboardTimestamps(
            obj.created_at,
            obj.updated_at
        );
        const name = obj.name;
        const description = obj.description;
        const markdownContent = obj.markdownContent;
        const codeActivated = Boolean(obj.codeActivated);
        const price = obj.price;
        const quantity = obj.quantity;
        const inputs: Array<BlueboardProductInput> = [];

        for (const input of obj.inputs) {
            inputs.push(
                new BlueboardProductInput(input.name, input.type, input.title)
            );
        }

        const imageName = obj.imageName;
        const visible = Boolean(obj.visible);
        const imageUrl = obj.imageUrl;
        const codeNames: Array<string> = [];

        for (const codeName of obj.codeNames) {
            codeNames.push(codeName);
        }

        const codes: Array<BlueboardQRCode> = [];

        if (obj.codes) {
            for (const code of obj.codes) {
                codes.push(BlueboardQRCodeFactory.getQRCode(code));
            }
        }

        return new BlueboardProduct(
            id,
            timestamps,
            name,
            description,
            markdownContent,
            codeActivated,
            price,
            quantity,
            inputs,
            imageName,
            visible,
            imageUrl,
            codeNames,
            codes
        );
    }
}

export default BlueboardProductFactory;
