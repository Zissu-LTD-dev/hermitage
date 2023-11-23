export const initialState = {
  userInfo: {},
  status: {
    title: "יצירת הזמנה חדשה",
    step: 1,
  },
  allProducts: [],
  activeDepartment: 1,
  displayProducts: [],
  providers: [],
  categories: [],
  orderedProducts: [],
  returnedProducts: [],
  summary: [],
};

export const CLEAR_STATE = "CLEAR_STATE";

export const SET_USER_INFO = "SET_USER_INFO";
export const SET_STATUS = "SET_STATUS";

export const SET_ALL_PRODUCTS = "SET_ALL_PRODUCTS";
export const SET_ACTIVE_DEPARTMENT = "SET_ACTIVE_DEPARTMENT";
export const SET_DISPLAY_PRODUCTS = "SET_DISPLAY_PRODUCTS";

export const ADD_ORDERED_PRODUCT = "ADD_ORDERED_PRODUCT";
export const REMOVE_ORDERED_PRODUCT = "REMOVE_ORDERED_PRODUCT";

export const ADD_RETURNED_PRODUCT = "ADD_RETURNED_PRODUCT";
export const REMOVE_RETURNED_PRODUCT = "REMOVE_RETURNED_PRODUCT";

export const SET_SUMMARY = "SET_SUMMARY";
export const CLEAR_ORDER = "CLEAR_ORDER";


export const orderReducer =  (state, action) => {
  switch (action.type) {
    case CLEAR_STATE:
      return initialState;
    case SET_USER_INFO:
      return { ...state, userInfo: action.payload };
      
    case SET_STATUS:
      if(action.payload === 1) return { ...state, status: { title: "יצירת הזמנה חדשה", step: action.payload } };
      if(action.payload === 2) return { ...state, status: { title: "סיכום ביניים", step: action.payload } };
      if(action.payload === 3) return { ...state, status: { title: "מוצרים להחזרה", step: action.payload } };
      if(action.payload === 4) return { ...state, status: { title: "סיכום ואישור הזמנה", step: action.payload } };

    case SET_ALL_PRODUCTS:
      return { ...state, allProducts: action.payload };
    case SET_ACTIVE_DEPARTMENT:
      return { ...state, activeDepartment: action.payload };

    case SET_DISPLAY_PRODUCTS:
      let products = state.allProducts.filter((product) => product.department === state.activeDepartment);

      let columnNumbers = [];
      let columnNames = [];
      let columns = [];

      products.forEach((product) => {
        if (!columnNumbers.includes(product.columnNumber)) {
          columnNumbers.push(product.columnNumber);
          columnNames.push({ columnName: product.columnName, number: product.columnNumber });
        }
      });

      columnNames.forEach((columnName) => {
        let column = { columnName: columnName.columnName, number: columnName.number, products: [] };
        products.forEach((product) => {
          if (product.columnNumber === columnName.number) {
            column.products.push(product);
          }
        });
        columns.push(column);
      });

      return { ...state, displayProducts: columns };

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
        orderedProducts: state.orderedProducts.filter((product) => product.barcode !== action.payload),
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
          returnedProducts: state.returnedProducts.filter((product) => product.barcode !== action.payload),
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
      return { ...state, status: { title: "הזמנה נשלחה בהצלחה", step: 5 } , summary: [], orderedProducts: [], returnedProducts: [] };
    default:
      return state;
  }
};
