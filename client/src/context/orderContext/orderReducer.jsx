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
};

export const SET_USER_INFO = "SET_USER_INFO";
export const SET_STATUS = "SET_STATUS";

export const SET_ALL_PRODUCTS = "SET_ALL_PRODUCTS";
export const SET_ACTIVE_DEPARTMENT = "SET_ACTIVE_DEPARTMENT";
export const SET_DISPLAY_PRODUCTS = "SET_DISPLAY_PRODUCTS";

export const ADD_ORDERED_PRODUCT = "ADD_ORDERED_PRODUCT";
export const REMOVE_ORDERED_PRODUCT = "REMOVE_ORDERED_PRODUCT";

export const ADD_RETURNED_PRODUCT = "ADD_RETURNED_PRODUCT";
export const REMOVE_RETURNED_PRODUCT = "REMOVE_RETURNED_PRODUCT";


export const orderReducer = (state, action) => {
  switch (action.type) {
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
      return {
        ...state,
        returnedProducts: [...state.returnedProducts, action.payload],
      };
    default:
      return state;
  }
};
