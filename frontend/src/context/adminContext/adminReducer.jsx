export const initialState = {
  status: "",
  confirmationOrders: [],

  filters: [],
  displayFilters: [],

  search: "",
  searchResults: [],

  categories: [],
  products: [],
  providers: [],
  subGroups: [],
  branches: [],
  typeBranches: [],
  documents: [],
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

export const SET_BLOCKED_PROVIDERS_BY_PROVIDER = "SET_BLOCKED_PROVIDERS_BY_PROVIDER";
export const SET_UNBLOCKED_PROVIDERS_BY_PROVIDER = "SET_UNBLOCKED_PROVIDERS_BY_PROVIDER";
export const SET_BLOCKED_PROVIDERS_BY_BRANCH = "SET_BLOCKED_PROVIDERS_BY_BRANCH";
export const SET_UNBLOCKED_PROVIDERS_BY_BRANCH = "SET_UNBLOCKED_PROVIDERS_BY_BRANCH";

export const SET_BLOCKED_PRODUCTS = "SET_BLOCKED_PRODUCTS";
export const SET_UNBLOCKED_PRODUCTS = "SET_UNBLOCKED_PRODUCTS";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";

export const SET_DOCUMENTS = "SET_DOCUMENTS";
export const ADD_DOCUMENT = "ADD_DOCUMENT";
export const UPDATE_DOCUMENT = "UPDATE_DOCUMENT";
export const DELETE_DOCUMENT = "DELETE_DOCUMENT";

export const adminReducer = (state, action) => {
  switch (action.type) {
    case SET_STATUS_ADMIN:
      return { ...state, status: action.payload };

    case SET_INITIAL_DATA:
      let {categories,  products, providers, subGroups, branches, typeBranches } = action.payload;
      return {
        ...state,
        categories: categories,
        products: products,
        providers: providers,
        subGroups: subGroups,
        branches: branches,
        typeBranches: typeBranches,
      };

    case SET_CONFIRMATION_ORDERS:
      return { ...state, confirmationOrders: action.payload };

    case CANCEL_ORDER_ADMIN:
      let newConfirmationOrdersCan = state.confirmationOrders.map((order) => {
        if (order._id == action.payload._id) {
          return action.payload;
        }
        return order;
      });
      return { ...state, confirmationOrders: newConfirmationOrdersCan };

    case APPROVE_ORDER_ADMIN:
      let newConfirmationOrdersApp = state.confirmationOrders.map((order) => {
        if (order._id == action.payload._id) {
          return action.payload;
        }
        return order;
      });
      return { ...state, confirmationOrders: newConfirmationOrdersApp };

    case DELETE_PRODUCT_ADMIN:
      let newConfirmationOrdersDel = state.confirmationOrders.map((order) => {
        if (order._id == action.payload._id) {
          return action.payload;
        }
        return order;
      });
      return { ...state, confirmationOrders: newConfirmationOrdersDel };

    case DECREASE_PRODUCT_ADMIN:
      let newConfirmationOrdersDE = state.confirmationOrders.map((order) => {
        if (order._id == action.payload._id) {
          return action.payload;
        }
        return order;
      });
      return { ...state, confirmationOrders: newConfirmationOrdersDE };

    case INCREASE_PRODUCT_ADMIN:
      let newConfirmationOrdersIN = state.confirmationOrders.map((order) => {
        if (order._id == action.payload._id) {
          return action.payload;
        }
        return order;
      });
      return { ...state, confirmationOrders: newConfirmationOrdersIN };

    case SET_FILTERS:
      return { ...state, filters: action.payload };

    case SET_ACTIVE_FILTERS:
      return { ...state, displayFilters: action.payload };

    case SET_SEARCH:
      return { ...state, search: action.payload };

    case SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };

    case SET_BLOCKED_PROVIDERS_BY_PROVIDER:
      let newBranches = state.branches.map((branch) => {
        if (action.payload.branchesList.includes(branch._id)) {
          if (
            !branch.blockedProviders.includes(action.payload.providerNumber)
          ) {
            branch.blockedProviders.push(action.payload.providerNumber);
          }
        }
        return branch;
      });
    return { ...state, branches: newBranches };

    case SET_UNBLOCKED_PROVIDERS_BY_PROVIDER:
      let newBranchesUn = state.branches.map((branch) => {
        if (action.payload.branchesList.includes(branch._id)) {
          if (branch.blockedProviders.includes(action.payload.providerNumber)) {
            branch.blockedProviders = branch.blockedProviders.filter(
              (provider) => provider != action.payload.providerNumber
            );
          }
        }
        return branch;
      });
      return { ...state, branches: newBranchesUn };

    case SET_BLOCKED_PROVIDERS_BY_BRANCH:
      let newBranchesBl = state.branches.map((branch) => {
        if (branch._id == action.payload.branchId) {
          action.payload.providersList.map((provider) => {
            if (!branch.blockedProviders.includes(provider)) {
              branch.blockedProviders.push(provider);
            }
          });
        }
        return branch;
      });
      return { ...state, branches: newBranchesBl };

    case SET_UNBLOCKED_PROVIDERS_BY_BRANCH:
      let newBranchesUnBl = state.branches.map((branch) => {
        if (branch._id == action.payload.branchId) {
          action.payload.providersList.map((provider) => {
            if (branch.blockedProviders.includes(provider)) {
              branch.blockedProviders = branch.blockedProviders.filter(
                (prov) => prov != provider
              );
            }
          });
        }
        return branch;
      });
      return { ...state, branches: newBranchesUnBl };

    case SET_BLOCKED_PRODUCTS:
      let newProductsBl = state.products.map((product) => {
        if (action.payload.includes(product.barcode)) {
          product.isBlocked = true;
        }
        return product;
      });
      return { ...state, products: newProductsBl };

    case SET_UNBLOCKED_PRODUCTS:
      let newProductsUnBl = state.products.map((product) => {
        if (action.payload.includes(product.barcode)) {
          product.isBlocked = false;
        }
        return product;
      });
      return { ...state, products: newProductsUnBl };
    
    case ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };
      
    case UPDATE_PRODUCT:
      let newProductsUp = state.products.map((product) => {
        if (product._id == action.payload._id) {
          return action.payload;
        }
        return product;
      });
      return { ...state, products: newProductsUp };
      
    case DELETE_PRODUCT:
        let newProductsDel = state.products.filter(
          (product) => product._id != action.payload
        );
        return { ...state, products: newProductsDel };

    case SET_DOCUMENTS:
      return { ...state, documents: action.payload };

    case ADD_DOCUMENT:
      return { ...state, documents: [...state.documents, action.payload] };

    case UPDATE_DOCUMENT:
      let newDocumentsUp = state.documents.map((document) => {
        if (document._id == action.payload.documentId) {
          return document = { ...document, forTo: [action.payload.branchId]};
        }
        return document;
      });
      return { ...state, documents: newDocumentsUp };

    case DELETE_DOCUMENT:
      let newDocumentsDel = state.documents.filter(
        (document) => document._id != action.payload
      );
      return { ...state, documents: newDocumentsDel };

      
  }
};
