import {
    BlueboardInventoryItem,
    BlueboardItemUse,
    BlueboardTimestamps,
} from "../models";

import BlueboardProductFactory from "./BlueboardProductFactory";

class BlueboardInventoryFactory {
    static getItem(obj: any) {
        const id = obj.id;
        const timestamps = new BlueboardTimestamps(
            obj.created_at,
            obj.updated_at
        );
        const usedAt = obj.used_at;
        const product = BlueboardProductFactory.getProduct(obj.product);
        const itemUse = obj.item_use
            ? new BlueboardItemUse(
                  obj.item_use.id,
                  new BlueboardTimestamps(
                      obj.item_use.created_at,
                      obj.item_use.updated_at
                  ),
                  obj.item_use.values,
                  undefined
              )
            : undefined;

        return new BlueboardInventoryItem(
            id,
            timestamps,
            usedAt,
            product,
            itemUse
        );
    }

    static getResponse(obj: any) {
        let items: Array<BlueboardInventoryItem> = [];

        if (obj == null) {
            return [];
        }

        if (typeof obj[Symbol.iterator] === "function") {
            for (const item of obj) {
                items.push(this.getItem(item));
            }

            return items;
        }

        return [];
    }
}

export default BlueboardInventoryFactory;
