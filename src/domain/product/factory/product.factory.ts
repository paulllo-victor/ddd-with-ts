import Product from "../entity/product";
import ProductInterface from "../entity/product.interface";
import ProductB from "../entity/productB";

export default class ProductFactory {
    public static create(type: string, name: string, price: number): ProductInterface {
        let product;
        switch (type) {
            case "a":
                product = new Product("123", name, price)
                break;
            case "b":
                product = new ProductB("123", name, price)
                break;
            default:
                throw new Error("Product type not supported")
        }

        return product;
    }
}