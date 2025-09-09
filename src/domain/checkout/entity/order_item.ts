export default class OrderItem {
    _id: string;
    _productId: string;
    _name: string;
    _price: number;
    _quantity: number;

    constructor(id: string, productId: string, name: string, price: number, quantity: number) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._quantity = quantity;
        this._productId = productId;
        this.validate();
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
        if (this._price <= 0) {
            throw new Error("Price must be greater than zero");
        }
        if (this._quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
        }
    }

    get total(): number {
        return this._price;
    }

    orderItemTotal(): number {
        return this._price * this._quantity;
    }

    get id(): string {
        return this._id
    }

    get price(): number {
        return this._price
    }

    get quantity(): number {
        return this._quantity
    }

    get name(): string {
        return this._name
    }

    get productId(): string {
        return this._productId
    }
}