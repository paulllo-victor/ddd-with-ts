import Address from "./domain/customer/value-object/address";
import Customer from "./domain/entity/customer";
import Order from "./domain/checkout/order";
import OrderItem from "./domain/checkout/entity/order_item";

let customer = new Customer("1", "Paulo");
const address = new Address("Rua 1", 123, "12345-678", "São Paulo");
customer.address = address;
customer.activate();

const item1 = new OrderItem("1", "Item 1", 10);
const item2 = new OrderItem("2", "Item 2", 20);
const order = new Order("1", "1", [item1, item2]);

console.log("Customer:", customer);
console.log("Order Total:", order.total);