import { Sequelize } from "sequelize-typescript";
import ProducRepository from "./product.repository";
import Product from "../../../../domain/product/entity/product";
import ProductModel from "./product.model";

describe("Product repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });


    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const prodRepo = new ProducRepository();
        const product = new Product("1", "Product 1", 100);

        await prodRepo.create(product);

        const productDb = await ProductModel.findOne({ where: { id: "1" } });
        expect(productDb.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 1",
            price: 100
        });
    });

    it("should update a product", async () => {
        const prodRepo = new ProducRepository();
        const product = new Product("1", "Product 1", 100);

        await prodRepo.create(product);

        product.changeName("Product 2");
        product.changePrice(200);
        await prodRepo.update(product);

        const productDb = await ProductModel.findOne({ where: { id: "1" } });
        expect(productDb?.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 2",
            price: 200
        });
    });

    it("should find a product", async () => {
        const prodRepo = new ProducRepository();
        const product = new Product("1", "Product 1", 100);

        await prodRepo.create(product);
        const productMode = await ProductModel.findOne({ where: { id: "1" } });
        const productDb = await prodRepo.find("1");

        expect(productMode?.toJSON()).toStrictEqual({
            id: productDb.id,
            name: productDb.name,
            price: productDb.price
        });
    });

    it("should find all products", async () => {
        const prodRepo = new ProducRepository();
        const product1 = new Product("1", "Product 1", 100);
        const product2 = new Product("2", "Product 2", 200);
        const products = [product1, product2];
        await prodRepo.create(product1);
        await prodRepo.create(product2);

        const foundProducts = await prodRepo.findAll();

        expect(foundProducts.length).toBe(2);
        expect(products).toEqual(foundProducts);
    });
})