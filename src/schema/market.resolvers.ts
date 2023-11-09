import { GraphQLResolverMap } from "@apollo/subgraph/dist/schema-helper";
import prisma from "../db";
import { GraphQLError } from "graphql";
import { AuthContext } from "../libs/auth";
import { checkAuthContextThrowError } from "../utils/context";
const resolvers: GraphQLResolverMap<AuthContext> = {
  Product: {
    category: async (parent: { categoryId: string }) => {
      const { categoryId } = parent;
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      if (!category) {
        throw new GraphQLError("Category not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
      return category;
    },
  },
  User: {
    products: async (parent: { id: string }) => {
      const { id } = parent;
      const products = await prisma.product.findMany({
        where: {
          userId: id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return products;
    },
  },
  Query: {
    discoverGlobalProducts: async () => {
      const products = await prisma.product.findMany({
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return products;
    },
    product: async (parent: unknown, args: { id: string }) => {
      const { id } = args;
      const product = await prisma.product.findUnique({
        where: {
          id,
        },
      });
      if (!product) {
        throw new GraphQLError("Product not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
      return product;
    },
    Categories: async () => {
      const categories = await prisma.category.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return categories;
    },
    productsByCategory: async (parent: unknown, args: { id: string }) => {
      const { id } = args;
      const products = await prisma.product.findMany({
        where: {
          categoryId: id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return products;
    },
  },
  Mutation: {
    createProduct: async (
      parent: unknown,
      args: {
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        categoryId: string | null;
      },
      context
    ) => {
      const { name, description, price, imageUrl, categoryId } = args;
      const category = await prisma.category.findFirst();
      if (!category) {
        throw new GraphQLError("Category not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
      const defaultCategoryId = category?.id;
      const userId = checkAuthContextThrowError(context);
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          imageUrl,
          categoryId: categoryId || defaultCategoryId,
          userId,
        },
      });
      return product;
    },
    deleteProduct: async (parent: unknown, args: { id: string }, context) => {
      const userId = checkAuthContextThrowError(context);
      const productId = args.id;
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        throw new GraphQLError("Product not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
      if (product.userId !== userId) {
        throw new GraphQLError("Unauthorized", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }
      const productUpdated = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          isDeleted: true,
        },
      });
      return productUpdated;
    },
    updateProduct: async (
      parent: unknown,
      args: {
        id: string;
        name: string | null;
        description: string | null;
        price: number | null;
        imageUrl: string | null;
        categoryId: string | null;
        isSold: boolean | null;
      },
      context
    ) => {
      const userId = checkAuthContextThrowError(context);
      const productId = args.id;
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        throw new GraphQLError("Product not found", {
          extensions: {
            code: "NOT_FOUND",
          },
        });
      }
      if (product.userId !== userId) {
        throw new GraphQLError("Unauthorized", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }
      const { name, description, price, imageUrl, categoryId, isSold } = args;
      const updatedProduct = await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          name: name || undefined,
          description,
          price: price || undefined,
          imageUrl,
          categoryId: categoryId || undefined,
          isSold: isSold || undefined,
        },
      });
      return updatedProduct;
    },
  },
};

export default resolvers;
