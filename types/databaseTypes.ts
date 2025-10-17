// types/prisma.ts - Updated for Restaurant Platform
import {
  Account as PrismaAccount,
  Category as PrismaCategory,
  CategoryProduct as PrismaCategoryProduct,
  CategoryTranslation as PrismaCategoryTranslation,
  Company as PrismaCompany,
  ContactSubmission as PrismaContactSubmission,
  Counter as PrismaCounter,
  Expense as PrismaExpense,
  GlobalSEO as PrismaGlobalSEO,
  LocationHistory as PrismaLocationHistory,
  NewLetter as PrismaNewLetter,
  UserNotification as PrismaUserNotification,
  OrderItem as PrismaOrderItem,
  Prisma,

  // NEW Restaurant Platform Types
  Country as PrismaCountry,
  CountryTranslation as PrismaCountryTranslation,
  Restaurant as PrismaRestaurant,
  RestaurantTranslation as PrismaRestaurantTranslation,
  RestaurantService as PrismaRestaurantService,
  RestaurantFeature as PrismaRestaurantFeature,
  RestaurantImage as PrismaRestaurantImage,
  RestaurantDish as PrismaRestaurantDish,
  Dish as PrismaDish,
  DishTranslation as PrismaDishTranslation,

  Reply as PrismaReply,
  Request as PrismaRequest,
  Review as PrismaReview,
  Shift as PrismaShift,
  SupportPing as PrismaSupportPing,
  Term as PrismaTerm,
  TermTranslation as PrismaTermTranslation,
  User as PrismaUser,
  WebVital as PrismaWebVital,
  WishlistItem as PrismaWishlistItem,
} from '@prisma/client';

// Re-export all types
export type Account = PrismaAccount;
export type Category = PrismaCategory;
export type CategoryProduct = PrismaCategoryProduct;
export type CategoryTranslation = PrismaCategoryTranslation;
export type Company = PrismaCompany;
export type ContactSubmission = PrismaContactSubmission;
export type Counter = PrismaCounter;
export type Expense = PrismaExpense;
export type GlobalSEO = PrismaGlobalSEO;
export type LocationHistory = PrismaLocationHistory;
export type NewLetter = PrismaNewLetter;
export type UserNotification = PrismaUserNotification;
export type OrderItem = PrismaOrderItem;

// NEW Restaurant Platform Types
export type Country = PrismaCountry;
export type CountryTranslation = PrismaCountryTranslation;
export type Restaurant = PrismaRestaurant;
export type RestaurantTranslation = PrismaRestaurantTranslation;
export type RestaurantService = PrismaRestaurantService;
export type RestaurantFeature = PrismaRestaurantFeature;
export type RestaurantImage = PrismaRestaurantImage;
export type RestaurantDish = PrismaRestaurantDish;
export type Dish = PrismaDish;
export type DishTranslation = PrismaDishTranslation;

// Backward compatibility aliases
export type Product = PrismaDish;
export type ProductTranslation = PrismaDishTranslation;
export type Supplier = PrismaCountry;
export type SupplierTranslation = PrismaCountryTranslation;

export type Reply = PrismaReply;
export type Request = PrismaRequest;
export type Review = PrismaReview;
export type Shift = PrismaShift;
export type SupportPing = PrismaSupportPing;
export type Term = PrismaTerm;
export type TermTranslation = PrismaTermTranslation;
export type User = PrismaUser;
export type WebVital = PrismaWebVital;
export type WishlistItem = PrismaWishlistItem;


export const orderIncludeRelation = {
  items: {
    include: {
      product: true,
    },
  },
  customer: true,
  driver: true,
  shift: true,
  address: true,
} satisfies Prisma.OrderInclude;

export type Order = Prisma.OrderGetPayload<{
  include: typeof orderIncludeRelation;
}>;

export const activeTripIncludeRelation = {
  order: {
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customer: true,
      driver: true,
      shift: true,
    },
  },
  driver: true,
} satisfies Prisma.ActiveTripInclude;

export type ActiveTrip = Prisma.ActiveTripGetPayload<{
  include: typeof activeTripIncludeRelation;
}>;


// Country (was Supplier) include relation
export const countryIncludeRelation = {
  restaurants: true,
  translations: true,
} satisfies Prisma.CountryInclude;

export type CountryWithRelations = Prisma.CountryGetPayload<{
  include: typeof countryIncludeRelation;
}>;

// Backward compatibility
export const supplierIncludeRelation = countryIncludeRelation;

export const categoryIncludeRelation = {
  productAssignments: {
    include: {
      product: true,
    },
  },
} satisfies Prisma.CategoryInclude;

export type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: typeof categoryIncludeRelation;
}>;



// Dish (was Product) include relation
export const dishIncludeRelation = {
  categoryAssignments: {
    include: {
      category: true,
    },
  },
  supplier: true, // Restaurant
  reviews: true,
  translations: true,
} satisfies Prisma.DishInclude;

export type DishWithRelations = Prisma.DishGetPayload<{
  include: typeof dishIncludeRelation;
}>;

// Restaurant include relation
export const restaurantIncludeRelation = {
  country: true,
  translations: true,
  services: true,
  features: true,
  images: true,
  dishes: {
    where: { published: true },
    take: 10,
  },
} satisfies Prisma.RestaurantInclude;

export type RestaurantWithRelations = Prisma.RestaurantGetPayload<{
  include: typeof restaurantIncludeRelation;
}>;

// Backward compatibility aliases
export const productIncludeRelation = dishIncludeRelation;
export type ProductWithCategories = DishWithRelations;
