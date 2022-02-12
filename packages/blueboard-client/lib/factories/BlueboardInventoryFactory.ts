import { BlueboardInventoryItem, BlueboardTimestamps } from '../models';
import BlueboardProductFactory from './BlueboardProductFactory';

class BlueboardInventoryFactory {
    static getItem(obj: any) {
        const id = obj.id;
        const timestamps = new BlueboardTimestamps(obj.created_at, obj.updated_at);
        const usedAt = obj.used_at;
        const product = BlueboardProductFactory.getProduct(obj.product);

        return new BlueboardInventoryItem(id, timestamps, usedAt, product);
    }

    static getResponse(arr: Array<any>) {
        let items: Array<BlueboardInventoryItem> = [];

        arr.forEach((element) => {
            const item = this.getItem(element);
            items.push(item);
        });

        return items;
    }
}

export default BlueboardInventoryFactory;
