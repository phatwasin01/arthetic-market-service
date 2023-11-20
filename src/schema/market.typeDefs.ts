import gql from "graphql-tag";

const typeDefs = gql`
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.0"
      import: ["@key", "@shareable"]
    )
  type Product @key(fields: "id userId") @shareable {
    id: ID!
    name: String
    description: String
    price: Int
    imageUrl: String
    userId: String!
    isSold: Boolean
    isDeleted: Boolean
    createdAt: String
    category: Category
  }
  type Category @key(fields: "id") {
    id: ID!
    name: String
  }
  type User @key(fields: "id") @shareable {
    id: ID!
    products: [Product!]!
  }
  type Query {
    discoverGlobalProducts: [Product!]!
    product(id: ID!): Product
    Categories: [Category]
    productsByCategory(id: ID!): [Product!]!
    myProducts: [Product!]!
  }
  type Mutation {
    createProduct(
      name: String!
      description: String
      price: Int!
      imageUrl: String
      categoryId: ID
    ): Product
    deleteProduct(id: ID!): Product
    unDeleteProduct(id: ID!): Product
    updateProduct(
      id: ID!
      name: String
      description: String
      price: Int
      imageUrl: String
      categoryId: ID
      isSold: Boolean
    ): Product
  }
`;

export default typeDefs;
