import BlueboardProductFactory from "./BlueboardProductFactory";
import { checkIterable } from "../BlueboardClientUtils";
import BlueboardTimestamps from "../models/BlueboardTimestamps";
import BlueboardItemUse from "../models/BlueboardItemUse";
import BlueboardInventoryItem from "../models/BlueboardInventoryItem";

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

        if (checkIterable(obj)) {
            for (const item of obj) {
                items.push(this.getItem(item));
            }
        }

        return items;
    }
}

export default BlueboardInventoryFactory;
