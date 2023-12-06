export const initialState = {
  status: "",
  confirmationOrders: [],
};

export const SET_STATUS_ADMIN = "SET_STATUS_ADMIN";
export const SET_CONFIRMATION_ORDERS = "SET_CONFIRMATION_ORDERS";
export const CANCEL_ORDER_ADMIN = "CANCEL_ORDER_ADMIN";
export const APPROVE_ORDER_ADMIN = "APPROVE_ORDER_ADMIN";
export const DELETE_PRODUCT_ADMIN = "DELETE_PRODUCT_ADMIN";
export const DECREASE_PRODUCT_ADMIN = "DECREASE_PRODUCT_ADMIN";
export const INCREASE_PRODUCT_ADMIN = "INCREASE_PRODUCT_ADMIN";

export const adminReducer = (state, action) => {
  switch (action.type) {
    case SET_STATUS_ADMIN:
      return { ...state, status: action.payload };

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

    default:
      return state;
  }
};
