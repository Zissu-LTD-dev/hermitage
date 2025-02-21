import { useState, useEffect } from "react";
import EditproductStyle from "../../../assets/css/admin/addingProducts/EditProduct.module.css";
import { useAdminContext } from "../../../context/adminContext/AdminContext";

function AddProduct({ cancel, save, product }) {
  const { state } = useAdminContext();

  let initialProduct = {
    barcode: "",
    name: product ? product.name : "",
    providerNumber: product ? product.providerNumber : "",
    providerName: product ? product.providerName : "",
    category: product ? product.category : 0,
    subGroupNumber: product ? product.subGroupNumber : "",
    subGroupName: product ? product.subGroupName : "",
    price: product ? product.price : "",
    packQuantity: product ? product.packQuantity : 1,
    isBlocked: product ? product.isBlocked : false,
    branchTypeConfig: [],
  };

  const [newProduct, setNewProduct] = useState(initialProduct);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [typeBranches, setTypeBranches] = useState([]);
  const [branchTypeConfig, setBranchTypeConfig] = useState([]);

  useEffect(() => {
    let renderProduct = { ...newProduct, branchTypeConfig: branchTypeConfig };
    setNewProduct(renderProduct);
  }, [branchTypeConfig]);

  useEffect(() => {
    let branchTypeConfig = [];
    typeBranches.forEach((branch) => {
      branchTypeConfig.push({
        branchType: branch.typeId,
        QuantityLimit: 0,
        location: {
          column: 0,
          shelf: 0,
          index: 0,
        },
      });
    });
    setBranchTypeConfig(branchTypeConfig);
  }, [typeBranches]);

  useEffect(() => {
    setProviders(state.providers);
    setCategories(state.categories.sort((a, b) => a.number - b.number));
    setSubGroups(state.subGroups);
    setTypeBranches(state.typeBranches.sort((a, b) => a.typeId - b.typeId));
  }, []);

  return (
    <div className={EditproductStyle.main}>
      <div className={EditproductStyle.content}>
        <div className={EditproductStyle.title}>הוספת פריט חדש</div>
        <div className={EditproductStyle.scrolling}>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>ברקוד</div>
            <input
              type='text'
              className={EditproductStyle.input}
              value={newProduct.barcode}
              onChange={(e) =>
                setNewProduct({ ...newProduct, barcode: e.target.value })
              }
              placeholder='הכנס ברקוד'
            />
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>שם</div>
            <input
              type='text'
              className={EditproductStyle.input}
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>ספק</div>
            <select
              className={EditproductStyle.input}
              value={newProduct.providerNumber}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  providerNumber: e.target.value,
                  providerName: e.target.selectedOptions[0].text
                    .split("|")[0]
                    .trim(),
                })
              }
            >
              <option value={newProduct.providerNumber}>
                {newProduct.providerName} | {newProduct.providerNumber}
              </option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider.number}>
                  {provider.name} | {provider.number}
                </option>
              ))}
            </select>
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>קטגוריה</div>
            <select
              className={EditproductStyle.input}
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            >
              <option value={newProduct.category}>
                {categories.find((cat) => cat.number == newProduct.category)
                  ? categories.find((cat) => cat.number == newProduct.category)
                      .name
                  : ""}
                | {newProduct.category}
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category.number}>
                  {category.name} | {category.number}
                </option>
              ))}
            </select>
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>קבוצת משנה</div>
            <select
              className={EditproductStyle.input}
              value={newProduct.subGroupName}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  subGroupNumber: e.target.value,
                  subGroupName: e.target.selectedOptions[0].text
                    .split("|")[0]
                    .trim(),
                })
              }
            >
              <option value={newProduct.subGroupNumber}>
                {newProduct.subGroupName} | {newProduct.subGroupNumber}
              </option>
              {subGroups.map((subGroup) => (
                <option key={subGroup._id} value={subGroup.number}>
                  {subGroup.name} | {subGroup.number}
                </option>
              ))}
            </select>
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>מחיר</div>
            <input
              type='number'
              className={EditproductStyle.input}
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>כמות באריזה</div>
            <input
              type='number'
              className={EditproductStyle.input}
              value={newProduct.packQuantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, packQuantity: e.target.value })
              }
            />
          </div>
          <div
            className={
              EditproductStyle.productDetails + " " + EditproductStyle.checkbox
            }
          >
            <div className={EditproductStyle.Text}>פריט חסום </div>
            <input
              type='checkbox'
              className={EditproductStyle.input}
              checked={newProduct.isBlocked}
              onChange={(e) =>
                setNewProduct({ ...newProduct, isBlocked: e.target.checked })
              }
            />
          </div>
          <div
            className={
              EditproductStyle.productDetails + " " + EditproductStyle.config
            }
          >
            <div className={EditproductStyle.Text}>:הגדרות לפי סניפים</div>
            <div className={EditproductStyle.configByBranch}>
              {typeBranches.map((branch) => (
                <div key={branch._id} className={EditproductStyle.branchRow}>
                  <div className={EditproductStyle.Text}>
                    {branch.name} | {branch.typeId}
                  </div>
                  <div
                    className={
                      EditproductStyle.productDetails +
                      " " +
                      EditproductStyle.location
                    }
                  >
                    <div>
                      <div className={EditproductStyle.Text}>הגבל פריט</div>
                      <input
                        type='number'
                        className={EditproductStyle.input}
                        min='0'
                        value={
                          branchTypeConfig.find(
                            (config) => config.branchType === branch.typeId
                          )?.QuantityLimit || 0
                        }
                        onChange={(e) => {
                          let newConfig = branchTypeConfig.map((config) => {
                            if (config.branchType === branch.typeId) {
                              return {
                                ...config,
                                QuantityLimit: e.target.value,
                              };
                            }
                            return config;
                          });
                          setBranchTypeConfig(newConfig);
                        }}
                      />
                    </div>
                    <div>
                      <div className={EditproductStyle.Text}>עמודה</div>
                      <input
                        type='number'
                        className={EditproductStyle.input}
                        value={
                          branchTypeConfig.find(
                            (config) => config.branchType === branch.typeId
                          )?.location.column || 0
                        }
                        onChange={(e) => {
                          let newConfig = branchTypeConfig.map((config) => {
                            if (config.branchType === branch.typeId) {
                              return {
                                ...config,
                                location: {
                                  ...config.location,
                                  column: e.target.value,
                                },
                              };
                            }
                            return config;
                          });
                          setBranchTypeConfig(newConfig);
                        }}
                      />
                    </div>
                    <div>
                      <div className={EditproductStyle.Text}>מדף</div>
                      <input
                        type='number'
                        className={EditproductStyle.input}
                        value={
                          branchTypeConfig.find(
                            (config) => config.branchType === branch.typeId
                          )?.location.shelf || 0
                        }
                        onChange={(e) => {
                          let newConfig = branchTypeConfig.map((config) => {
                            if (config.branchType === branch.typeId) {
                              return {
                                ...config,
                                location: {
                                  ...config.location,
                                  shelf: e.target.value,
                                },
                              };
                            }
                            return config;
                          });
                          setBranchTypeConfig(newConfig);
                        }}
                      />
                    </div>
                    <div>
                      <div className={EditproductStyle.Text}>מיקום</div>
                      <input
                        type='number'
                        className={EditproductStyle.input}
                        value={
                          branchTypeConfig.find(
                            (config) => config.branchType === branch.typeId
                          )?.location.index || 0
                        }
                        onChange={(e) => {
                          let newConfig = branchTypeConfig.map((config) => {
                            if (config.branchType === branch.typeId) {
                              return {
                                ...config,
                                location: {
                                  ...config.location,
                                  index: e.target.value,
                                },
                              };
                            }
                            return config;
                          });
                          setBranchTypeConfig(newConfig);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={EditproductStyle.btns}>
          <div
            className={EditproductStyle.save}
            onClick={() => save(newProduct)}
          >
            שמור
          </div>
          <div className={EditproductStyle.cancel} onClick={cancel}>
            ביטול
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
