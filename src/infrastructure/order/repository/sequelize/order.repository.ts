import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order.repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        try {
            await OrderModel.create({
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity
                }))
            },
                {
                    include: [{ model: OrderItemModel }]
                });
        } catch (error) {
            console.log(error)
            process.exit()
        }
    }

    async find(id: string): Promise<Order> {
        const orderDB = await OrderModel.findOne({ where: { id }, include: ["items"] });
        const itemsDB = orderDB?.items.map(
            (item) =>
                new OrderItem(
                    item.id,
                    item.product_id,
                    item.name,
                    item.price,
                    item.quantity
                )
        ) ?? [];

        let order = new Order(orderDB?.id, orderDB?.customer_id, itemsDB)
        return order;
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                customer_id: entity.customerId,
                total: entity.total()
            },
            {
                where: { id: entity.id }
            });


        for (const item of entity.items) {
            await OrderItemModel.upsert({
                id: item.id,
                order_id: entity.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity
            })
        }

    }

    async findAll(): Promise<Order[]> {
        const ordersDB = await OrderModel.findAll({ include: ["items"] });
        const orders = ordersDB?.map(
            (order) => {
                let items = order.items.map((item) =>
                    new OrderItem(
                        item.id,
                        item.product_id,
                        item.name,
                        item.price,
                        item.quantity
                    ))

                return new Order(order.id, order.customer_id, items)
            }

        ) ?? [];

        return orders;
    }
}