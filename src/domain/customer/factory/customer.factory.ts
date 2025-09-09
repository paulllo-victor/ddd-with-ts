import Customer from "../entity/customer";
import CustomerInterface from "../entity/customer.interface";
import Address from "../value-object/address";

export default class CustomerFactory {
    public static create(name: string): CustomerInterface {
        return new Customer("123", name)
    }

    public static createWithAddress(name: string, address: Address): CustomerInterface {
        const customer = new Customer("123", name)
        customer.changeAddress(address)

        return customer
    }
}