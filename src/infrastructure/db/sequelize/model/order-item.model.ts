import { Model, PrimaryKey, Table, Column, ForeignKey, BelongsTo } from "sequelize-typescript";
import ProductModel from "./product.model";

@Table({
    tableName: "order_items",
    timestamps: false
})

export default class OrderItemModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @ForeignKey(() => require("./order.model").default)
    @Column({ allowNull: false })
    declare order_id: string;

    @BelongsTo(() => require("./order.model").default)
    declare order: OrderModel;

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare product_id: string;

    @BelongsTo(() => ProductModel)
    declare product: ProductModel;

    @Column({ allowNull: false })
    declare quantity: number;

    @Column({ allowNull: false })
    declare price: number;
}