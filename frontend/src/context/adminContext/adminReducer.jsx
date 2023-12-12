export const initialState = {
  status: "",
  confirmationOrders: [],

  filters: [],
  displayFilters: [],

  search: "",
  searchResults: [],

  products: [],
  providers: [],
  categories: [],
  branches: [],
};

export const SET_STATUS_ADMIN = "SET_STATUS_ADMIN";

export const SET_INITIAL_DATA = "SET_INITIAL_DATA"; 

export const SET_CONFIRMATION_ORDERS = "SET_CONFIRMATION_ORDERS";
export const CANCEL_ORDER_ADMIN = "CANCEL_ORDER_ADMIN";
export const APPROVE_ORDER_ADMIN = "APPROVE_ORDER_ADMIN";
export const DELETE_PRODUCT_ADMIN = "DELETE_PRODUCT_ADMIN";
export const DECREASE_PRODUCT_ADMIN = "DECREASE_PRODUCT_ADMIN";
export const INCREASE_PRODUCT_ADMIN = "INCREASE_PRODUCT_ADMIN";

export const SET_FILTERS = "SET_FILTERS";
export const SET_ACTIVE_FILTERS = "SET_ACTIVE_FILTERS";

export const SET_SEARCH = "SET_SEARCH";
export const SET_SEARCH_RESULTS = "SET_SEARCH_RESULTS";


export const adminReducer = (state, action) => {
  switch (action.type) {
    case SET_STATUS_ADMIN:
      return { ...state, status: action.payload };

    case SET_INITIAL_DATA:
      let { products, providers, categories, branches} = action.payload; 
      return { ...state, products: products, providers: providers, categories: categories, branches: branches };

    case SET_CONFIRMATION_ORDERS:
      return { ...state, confirmationOrders: action.payload};

    case CANCEL_ORDER_ADMIN:
      let newConfirmationOrdersCan = state.confirmationOrders.map(
        (order) => {
          if (order._id == action.payload._id) {
            return action.payload;
          }
          return order;
        }
      );
      return { ...state, confirmationOrders: newConfirmationOrdersCan };

    case APPROVE_ORDER_ADMIN:
      let newConfirmationOrdersApp = state.confirmationOrders.map(
        (order) => {
          if (order._id == action.payload._id) {
            return action.payload;
          }
          return order;
        }
      );
      return { ...state, confirmationOrders: newConfirmationOrdersApp };

    case DELETE_PRODUCT_ADMIN:
      let newConfirmationOrdersDel = state.confirmationOrders.map(
        (order) => {
          if (order._id == action.payload._id) {
            return action.payload;
          }
          return order;
        }
      );
      return { ...state, confirmationOrders: newConfirmationOrdersDel };

    case DECREASE_PRODUCT_ADMIN:
      let newConfirmationOrdersDE = state.confirmationOrders.map(
        (order) => {
          if (order._id == action.payload._id) {
            return action.payload;
          }
          return order;
        }
      );
      return { ...state, confirmationOrders: newConfirmationOrdersDE };

    case INCREASE_PRODUCT_ADMIN:
      let newConfirmationOrdersIN  = state.confirmationOrders.map(
        (order) => {
          if (order._id == action.payload._id) {
            return action.payload;
          }
          return order;
        }
      );
      return { ...state, confirmationOrders: newConfirmationOrdersIN };

    
    case SET_FILTERS:
      return { ...state, filters: action.payload };

    case SET_ACTIVE_FILTERS:
      return { ...state, displayFilters: action.payload };

    case SET_SEARCH:
      return { ...state, search: action.payload };

    case SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };

  }
};
