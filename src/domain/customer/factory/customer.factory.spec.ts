import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit test", () => {
    it("should create a customer", () => {
        let customer = CustomerFactory.create("Paulo")

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Paulo");
        expect(customer.address).toBeUndefined();
    });

    it("should create a customer with an address", () => {
        const address = new Address("street", 123, "12345", "Recife")
        let customer = CustomerFactory.createWithAddress("Paulo", address)

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Paulo");
        expect(customer.address).toBeUndefined();
    });
})