import { BlueboardInventoryItem, BlueboardTimestamps, BlueboardItemUse } from '../models';
import BlueboardProductFactory from './BlueboardProductFactory';

class BlueboardInventoryFactory {
    static getItem(obj: any) {
        const id = obj.id;
        const timestamps = new BlueboardTimestamps(obj.created_at, obj.updated_at);
        const usedAt = obj.used_at;
        const product = BlueboardProductFactory.getProduct(obj.product);
        const itemUse = obj.item_use
            ? new BlueboardItemUse(
                  obj.item_use.id,
                  new BlueboardTimestamps(obj.item_use.created_at, obj.item_use.updated_at),
                  obj.item_use.values,
                  undefined
              )
            : undefined;

        return new BlueboardInventoryItem(id, timestamps, usedAt, product, itemUse);
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
