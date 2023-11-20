export const initialState = {
  allProducts: [],
  activeDepartment: 1,
  displayProducts: [],
  providers: [],
  categories: [],
  orderedProducts: [],
  returnedProducts: [],
};

export const SET_ALL_PRODUCTS = "SET_ALL_PRODUCTS";
export const ADD_ORDERED_PRODUCT = "ADD_ORDERED_PRODUCT";
export const ADD_RETURNED_PRODUCT = "ADD_RETURNED_PRODUCT";
export const SET_ACTIVE_DEPARTMENT = "SET_ACTIVE_DEPARTMENT";
export const SET_DISPLAY_PRODUCTS = "SET_DISPLAY_PRODUCTS";

export const orderReducer = (state, action) => {
  switch (action.type) {
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
      return {
        ...state,
        orderedProducts: [...state.orderedProducts, action.payload],
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
