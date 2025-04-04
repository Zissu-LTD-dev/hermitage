export const initialState = {
  userInfo: {},
  branchType: null,
  showLoader: false,
  showError: {
    show: false,
    message: "",
  },
  showSuccess: {
    show: false,
    message: "",
  },
  showWarning: {
    show: false,
    message: "",
  },
  activeNavbar: false,

  status: "messages",
  statusOrder: {
    title: "יצירת הזמנה חדשה",
    step: 1,
  },

  allProducts: [],
  activeCategory: 1,
  locationProductsConfig: [],

  displayProducts: [],
  displayProductsConfig: [],

  filters: [],
  displayFilters: [],

  search: "",
  searchResults: [],

  providers: [],

  categories: [],
  subGroups: [],

  orderedProducts: [],
  returnedProducts: [],
  summary: [],

  documents: [],
  unreadMessages: 0,
};

export const CLEAR_STATE = "CLEAR_STATE";

export const SET_SHOW_LOADER = "SET_SHOW_LOADER";
export const SET_SHOW_ERROR = "SET_SHOW_ERROR";
export const SET_SHOW_SUCCESS = "SET_SHOW_SUCCESS";
export const SET_SHOW_WARNING = "SET_SHOW_WARNING";

export const SET_USER_INFO = "SET_USER_INFO";
export const READ_MESSAGE = "READ_MESSAGE";

// SET_CURRENT_BRANCH for admin
export const SET_CURRENT_BRANCH = "SET_CURRENT_BRANCH";

export const SET_ACTIVE_NAVBAR = "SET_ACTIVE_NAVBAR";

export const SET_TYPE_BRANCH = "SET_TYPE_BRANCH";

// manager 👇
export const SET_STATUS = "SET_STATUS";
export const SET_STATUS_ORDER = "SET_STATUS_ORDER";

export const SET_CATEGORY = "SET_CATEGORY";
export const SET_SUB_GROUPS = "SET_SUB_GROUPS";

export const SET_ALL_PRODUCTS = "SET_ALL_PRODUCTS";
export const SET_CONFIG_PRODUCTS = "SET_CONFIG_PRODUCTS";
export const SET_ACTIVE_CATEGORY = "SET_ACTIVE_CATEGORY";
export const SET_DISPLAY_PRODUCTS = "SET_DISPLAY_PRODUCTS";

export const SET_FILTERS = "SET_FILTERS";
export const SET_ACTIVE_FILTERS = "SET_ACTIVE_FILTERS";

export const SET_SEARCH = "SET_SEARCH";
export const SET_SEARCH_RESULTS = "SET_SEARCH_RESULTS";

export const ADD_ORDERED_PRODUCT = "ADD_ORDERED_PRODUCT";
export const REMOVE_ORDERED_PRODUCT = "REMOVE_ORDERED_PRODUCT";

export const ADD_RETURNED_PRODUCT = "ADD_RETURNED_PRODUCT";
export const REMOVE_RETURNED_PRODUCT = "REMOVE_RETURNED_PRODUCT";

export const SET_SUMMARY = "SET_SUMMARY";
export const UPDATE_SUMMARY = "UPDATE_SUMMARY";
export const CLEAR_ORDER = "CLEAR_ORDER";

export const SET_DOCUMENTS = "SET_DOCUMENTS";
export const SET_UNREAD_MESSAGES = "SET_UNREAD_MESSAGES";

export const mainReducer = (state, action) => {
  switch (action.type) {
    case CLEAR_STATE:
      return initialState;

    case SET_SHOW_LOADER:
      return { ...state, showLoader: action.payload };
    case SET_SHOW_ERROR:
      return { ...state, showError: action.payload };
    case SET_SHOW_SUCCESS:
      return { ...state, showSuccess: action.payload };
    case SET_SHOW_WARNING:
      return { ...state, showWarning: action.payload };

    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
        branchType: action.payload.branch?.branchTypeNumber
          ? action.payload.branch.branchTypeNumber
          : null,
      };

    case READ_MESSAGE:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          branch: {
            ...state.userInfo.branch,
            messages: state.userInfo.branch.messages.map((msg) => {
              return { ...msg, read: true };
            }),
          },
        },
      };

    case SET_CURRENT_BRANCH:
      if (action.payload === null) {
        return {
          ...state,
          branchType: null,
          userInfo: { ...state.userInfo, branch: null },
        };
      }
      return {
        ...state,
        branchType: action.payload.branchTypeNumber,
        userInfo: { ...state.userInfo, branch: action.payload },
      };

    case SET_ACTIVE_NAVBAR:
      return { ...state, activeNavbar: action.payload };

    case SET_TYPE_BRANCH:
      return { ...state, branchType: action.payload };

    // manager 👇
    case SET_STATUS:
      return { ...state, status: action.payload };

    case SET_STATUS_ORDER:
      if (action.payload === 1)
        return {
          ...state,
          statusOrder: { title: "יצירת הזמנה חדשה", step: action.payload },
        };
      if (action.payload === 2)
        return {
          ...state,
          statusOrder: { title: "סיכום ביניים", step: action.payload },
        };
      if (action.payload === 3)
        return {
          ...state,
          statusOrder: { title: "מוצרים להחזרה", step: action.payload },
        };
      if (action.payload === 4)
        return {
          ...state,
          statusOrder: { title: "סיכום ואישור הזמנה", step: action.payload },
        };

    case SET_CATEGORY:
      return { ...state, categories: action.payload };
    case SET_SUB_GROUPS:
      return { ...state, subGroups: action.payload };

    case SET_ALL_PRODUCTS:
      let newProducts = action.payload.map((product) => {
        let newConfig = {};
        let location = {};
        let QuantityLimit = 0;

        product.branchTypeConfig.forEach((config) => {
          if (config.branchType === state.branchType) {
            QuantityLimit = config.QuantityLimit;
            location = config.location;
            newConfig = config;
          }
        });

        return {
          ...product,
          location: location,
          branchTypeConfig: newConfig,
          QuantityLimit: QuantityLimit,
        };
      });

      newProducts = newProducts.filter((row) => row);

      return { ...state, allProducts: newProducts };

    case SET_CONFIG_PRODUCTS:
      // סינון לפי סוג הסניף שמחובר
      let currentTypeBranch = `branchType${state.branchType}`;
      let newProductsConfig = action.payload.map((config) => {
        let newConfig = {};
        for (let key in config) {
          if (!key.startsWith("branchType")) {
            newConfig[key] = config[key];
          } else if (key === currentTypeBranch) {
            newConfig["currentBranch"] = config[key];
          }
        }
        return newConfig;
      });
      return { ...state, locationProductsConfig: newProductsConfig };

    case SET_ACTIVE_CATEGORY:
      return { ...state, activeCategory: action.payload };
    // Fix for SET_DISPLAY_PRODUCTS case in mainReducer.jsx
    // Replace the current case with this implementation:

    case SET_DISPLAY_PRODUCTS:
      let products = state.allProducts.filter(
        (product) => product.category === state.activeCategory
      );

      let config = state.locationProductsConfig.filter(
        (config) => config.categoryNumber === state.activeCategory
      );

      let newColumns = [];
      config.forEach((column) => {
        if (
          newColumns.some(
            (newColumn) => newColumn.columnsNumber === column.columnsNumber
          )
        )
          return;

        newColumns.push({
          columnsName: column.columnsName,
          columnsNumber: column.columnsNumber,
          shelves: [],
        });
      });

      // Step 1: Initialize shelves based on config
      config.forEach((column) => {
        newColumns.forEach((newColumn) => {
          if (newColumn.columnsNumber === column.columnsNumber) {
            if (
              column.shelvesNumber !== "פתוח" &&
              column.shelvesNumber.length > 1
            ) {
              let numShelves = column.currentBranch
                ? column.currentBranch.split(" ")[0]
                : column.shelvesNumber.split(",").pop();

              numShelves = parseInt(numShelves);

              for (let i = 1; i <= numShelves; i++) {
                newColumn.shelves.push({
                  shelvesName: `מדף ${i}`,
                  shelvesNumber: i,
                  currentBranch: column.currentBranch,
                });
              }
            } else {
              newColumn.shelves.push({
                shelvesName: column.shelvesName,
                shelvesNumber: column.shelvesNumber,
                currentBranch: column.currentBranch,
              });
            }
          }
        });
      });

      // Step 2: Check for products with negative shelf numbers and add them to the configuration
      products.forEach((product) => {
        if (
          product.location &&
          product.location.shelf &&
          product.location.shelf < 0
        ) {
          const columnNumber = product.location.column;
          const shelfNumber = product.location.shelf;

          // Find the column for this product
          const column = newColumns.find(
            (col) => col.columnsNumber === columnNumber
          );

          if (column) {
            // Check if this negative shelf already exists in the column
            const shelfExists = column.shelves.some(
              (shelf) => parseInt(shelf.shelvesNumber) === shelfNumber
            );

            // If not, add it
            if (!shelfExists) {
              column.shelves.push({
                shelvesName: `מדף ${shelfNumber}`,
                shelvesNumber: shelfNumber,
                currentBranch: column.shelves[0]?.currentBranch || null,
              });
            }
          }
        }
      });

      // Sort shelves within each column
      newColumns.forEach((column) => {
        column.shelves.sort((a, b) => {
          if (a.shelvesNumber === "פתוח") return -1;
          if (b.shelvesNumber === "פתוח") return 1;
          return parseInt(a.shelvesNumber) - parseInt(b.shelvesNumber);
        });
      });

      newColumns.sort((a, b) => a.columnsNumber - b.columnsNumber);
      return {
        ...state,
        displayProducts: products,
        displayProductsConfig: newColumns,
      };
    case SET_FILTERS:
      return { ...state, filters: action.payload };

    case SET_ACTIVE_FILTERS:
      return { ...state, displayFilters: action.payload };

    case SET_SEARCH:
      return { ...state, search: action.payload };

    case SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };

    case ADD_ORDERED_PRODUCT:
      let productExists = false;
      let orderedProducts = state.orderedProducts.map((product) => {
        if (product.barcode === action.payload.barcode) {
          productExists = true;
          return {
            ...product,
            quantity: action.payload.quantity,
            originalQuantity: action.payload.originalQuantity,
          };
        } else {
          return product;
        }
      });
      if (!productExists) {
        orderedProducts.push(action.payload);
      }
      return { ...state, orderedProducts: orderedProducts };
    case REMOVE_ORDERED_PRODUCT:
      return {
        ...state,
        orderedProducts: state.orderedProducts.filter(
          (product) => product.barcode !== action.payload
        ),
      };

    case ADD_RETURNED_PRODUCT:
      let returneProductExists = false;
      let returnedProducts = state.returnedProducts.map((product) => {
        if (product.barcode === action.payload.barcode) {
          returneProductExists = true;
          return { ...product, quantity: action.payload.quantity };
        } else {
          return product;
        }
      });
      if (!returneProductExists) {
        returnedProducts.push(action.payload);
      }
      return { ...state, returnedProducts: returnedProducts };

    case REMOVE_RETURNED_PRODUCT:
      return {
        ...state,
        returnedProducts: state.returnedProducts.filter(
          (product) => product.barcode !== action.payload
        ),
      };

    case SET_SUMMARY:
      let summary = [];

      state.orderedProducts.forEach((product) => {
        let providerExists = false;
        summary.forEach((provider) => {
          if (
            provider.providerNumber == product.providerNumber &&
            product.quantity > 0
          ) {
            providerExists = true;

            provider.orderLines.products.push(product);
            provider.orderLines.quantity += product.quantity;
            provider.totalOrderQty += product.quantity;
            provider.totalOrderAmount += product.price * product.quantity;
          }
        });
        if (!providerExists && product.quantity > 0) {
          summary.push({
            providerNumber: product.providerNumber,
            providerName: product.providerName,
            orderLines: {
              products: [product],
              quantity: product.quantity,
            },
            returnLines: { products: [], quantity: 0 },
            totalOrderQty: product.quantity,
            totalOrderAmount: product.price * product.quantity,
            totalReturnQty: 0,
            totalReturnAmount: 0,
            noteProvider: "",
            noteManager: "",
          });
        }
      });

      state.returnedProducts.forEach((product) => {
        let providerExists = false;
        summary.forEach((provider) => {
          if (
            provider.providerNumber === product.providerNumber &&
            product.quantity > 0
          ) {
            providerExists = true;

            provider.returnLines.products.push(product);
            provider.returnLines.quantity += product.quantity;
            provider.totalReturnQty += product.quantity;
            provider.totalReturnAmount += product.price * product.quantity;
          }
        });
        if (!providerExists && product.quantity > 0) {
          summary.push({
            providerNumber: product.providerNumber,
            providerName: product.providerName,
            orderLines: { products: [], quantity: 0 },
            returnLines: {
              products: [product],
              quantity: product.quantity,
            },
            totalOrderQty: 0,
            totalOrderAmount: 0,
            totalReturnQty: product.quantity,
            totalReturnAmount: product.price * product.quantity,
            noteProvider: "",
            noteManager: "",
          });
        }
      });

      return { ...state, summary: summary };

    case UPDATE_SUMMARY:
      let { index, noteProvider, noteManager } = action.payload;
      let newSummary = state.summary.map((provider, i) => {
        if (i === index) {
          return { ...provider, noteProvider, noteManager };
        } else {
          return provider;
        }
      });

      return { ...state, summary: newSummary };

    case CLEAR_ORDER:
      return {
        ...state,
        statusOrder: { title: "יצירת הזמנה חדשה", step: 1 },
        summary: [],
        orderedProducts: [],
        returnedProducts: [],
      };

    case SET_DOCUMENTS:
      return { ...state, documents: action.payload };

    case SET_UNREAD_MESSAGES:
      return { ...state, unreadMessages: action.payload };

    default:
      return state;
  }
};
