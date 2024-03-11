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

  status: "new order",
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
};

export const CLEAR_STATE = "CLEAR_STATE";

export const SET_SHOW_LOADER = "SET_SHOW_LOADER";
export const SET_SHOW_ERROR = "SET_SHOW_ERROR";
export const SET_SHOW_SUCCESS = "SET_SHOW_SUCCESS";
export const SET_SHOW_WARNING = "SET_SHOW_WARNING";

export const SET_USER_INFO = "SET_USER_INFO";

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
export const CLEAR_ORDER = "CLEAR_ORDER";

export const SET_DOCUMENTS = "SET_DOCUMENTS";

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
        branchType: action.payload.branch.branchTypeNumber,
      };

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
      return { ...state, allProducts: action.payload };
    case SET_CONFIG_PRODUCTS:
      // סינון לפי סוג הסניף שמחובר
      let currentTypeBranch = `branchType${state.branchType}`;
      let newProductsConfig = action.payload.map((config) => {
        let newConfig = {};
        for (let key in config) {
          if (!key.startsWith("branchType")) {
            newConfig[key] = config[key];
          }else if (key === currentTypeBranch){
            newConfig['currentBranch'] = config[key];
          }
        }
        return newConfig;
      });
      return { ...state, locationProductsConfig: newProductsConfig };

    case SET_ACTIVE_CATEGORY:
      return { ...state, activeCategory: action.payload };

    case SET_DISPLAY_PRODUCTS:
      let products = state.allProducts.filter(
        (product) => product.category === state.activeCategory
      );

      let config = state.locationProductsConfig.filter(
        (config) => config.categoryNumber === state.activeCategory
      );

      return {
        ...state,
        displayProducts: products,
        displayProductsConfig: config,
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
          return { ...product, quantity: action.payload.quantity };
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
          if (provider.providerName === product.providerName) {
            providerExists = true;
            provider.productsOrder.push(product);
            provider.sumOrder += product.quantity;
          }
        });
        if (!providerExists) {
          summary.push({
            provider: product.provider,
            providerName: product.providerName,
            productsOrder: [product],
            productsReturn: [],
            sumOrder: product.quantity,
            sumReturn: 0,
            sumTotal: 0,
          });
        }
      });

      state.returnedProducts.forEach((product) => {
        let providerExists = false;
        summary.forEach((provider) => {
          if (provider.providerName === product.providerName) {
            providerExists = true;
            provider.productsReturn.push(product);
            provider.sumReturn += product.quantity;
          }
        });
        if (!providerExists) {
          summary.push({
            provider: product.provider,
            providerName: product.providerName,
            productsOrder: [],
            productsReturn: [product],
            sumOrder: 0,
            sumReturn: product.quantity,
            sumTotal: 0,
          });
        }
      });

      summary.forEach((provider) => {
        provider.sumTotal = provider.sumOrder - provider.sumReturn;
      });

      return { ...state, summary: summary };

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

    default:
      return state;
  }
};
