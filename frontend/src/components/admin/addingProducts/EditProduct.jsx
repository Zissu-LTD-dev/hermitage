import { useState, useEffect } from "react";
import EditproductStyle from "../../../assets/css/admin/addingProducts/EditProduct.module.css";
import { useAdminContext } from "../../../context/adminContext/AdminContext";

function EditProduct({ product, cancel, save }) {
  const { state, dispatch } = useAdminContext();

  const [newProduct, setNewProduct] = useState(product);
  const [categories, setCategories] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [typeBranches, setTypeBranches] = useState([]);
  const { barcode } = product;

  const [branchTypeConfig, setBranchTypeConfig] = useState([]);
  const [currentBranchTypeConfig, setCurrentBranchTypeConfig] = useState("1");

  useEffect(() => {
    let renderProduct = { ...newProduct, branchTypeConfig: branchTypeConfig };
    setNewProduct(renderProduct);
  }, [branchTypeConfig]);

  useEffect(() => {
    let branchTypeConfig = [];
    typeBranches.forEach((branch) => {
      let config = product.branchTypeConfig.find(
        (config) => config.branchType == branch.typeId
      );
      if (config) {
        branchTypeConfig.push(config);
      } else {
        branchTypeConfig.push({
          branchType: branch.typeId,
          available: true,
          location: {
            column: 0,
            shelf: 0,
            index: 0,
          },
        });
      }
    });
    setBranchTypeConfig(branchTypeConfig);
  }, [typeBranches]);

  useEffect(() => {
    setCategories(state.categories.sort((a, b) => a.number - b.number));
    setSubGroups(state.subGroups);
    setTypeBranches(state.typeBranches);
  }, []);
  return (
    <>
      <div className={EditproductStyle.main}>
        <div className={EditproductStyle.content}>
          <div className={EditproductStyle.title}>
            עריכת פריט ברקוד : {barcode}{" "}
          </div>
          <div className={EditproductStyle.scrolling}>
            <div className={EditproductStyle.productDetails}>
              <div className={EditproductStyle.Text}>שם</div>
              <input
                type="text"
                className={EditproductStyle.input}
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
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
                type="number"
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
                type="text"
                className={EditproductStyle.input}
                value={!newProduct.packQuantity ? 1 : newProduct.packQuantity}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, packQuantity: e.target.value })
                }
              />
            </div>
            <div
              className={
                EditproductStyle.productDetails +
                " " +
                EditproductStyle.checkbox
              }
            >
              <div className={EditproductStyle.Text}>פריט חסום </div>
              <input
                type="checkbox"
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
              {/* select  branch */}
              <select
                className={EditproductStyle.input}
                value={newProduct.branchType}
                onChange={(e) => setCurrentBranchTypeConfig(e.target.value)}
              >
                {typeBranches.map((branch) => (
                  <option key={branch._id} value={branch.typeId}>
                    {branch.name} | {branch.typeId}
                  </option>
                ))}
              </select>
              <div className={EditproductStyle.configByBranch}>
                <div className={EditproductStyle.Text}>
                  סניף{" "}
                  {typeBranches.length > 0 &&
                    typeBranches.find(
                      (branch) => branch.typeId == currentBranchTypeConfig
                    ).name}
                </div>
                {/* location */}
                <div
                  className={
                    EditproductStyle.productDetails +
                    " " +
                    EditproductStyle.location
                  }
                >
                  {/* חסימת פריט */}
                  <div
                    className={
                      EditproductStyle.productDetails +
                      " " +
                      EditproductStyle.checkbox
                    }
                  >
                    <div className={EditproductStyle.Text}>חסימת פריט </div>
                    <input
                      type="checkbox"
                      className={EditproductStyle.input}
                      checked={
                        branchTypeConfig.length > 0 &&
                        branchTypeConfig[currentBranchTypeConfig - 1].available
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        let newConfig = branchTypeConfig.map((config) => {
                          if (config.branchType == currentBranchTypeConfig) {
                            return { ...config, available: e.target.checked };
                          }
                          return config;
                        });
                        setBranchTypeConfig(newConfig);
                      }}
                    />
                  </div>

                  <div className={EditproductStyle.Text}>עמודה</div>
                  <input
                    type="number"
                    className={EditproductStyle.input}
                    value={
                      branchTypeConfig.length > 0 &&
                      branchTypeConfig[currentBranchTypeConfig - 1].location
                        .column
                        ? branchTypeConfig[currentBranchTypeConfig - 1].location
                            .column
                        : 0
                    }
                    onChange={(e) => {
                      let newConfig = branchTypeConfig.map((config) => {
                        if (config.branchType == currentBranchTypeConfig) {
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
                  <div className={EditproductStyle.Text}>מדף</div>
                  <input
                    type="number"
                    className={EditproductStyle.input}
                    value={
                      branchTypeConfig.length > 0 &&
                      branchTypeConfig[currentBranchTypeConfig - 1].location
                        .shelf
                        ? branchTypeConfig[currentBranchTypeConfig - 1].location
                            .shelf
                        : 0
                    }
                    onChange={(e) => {
                      let newConfig = branchTypeConfig.map((config) => {
                        if (config.branchType == currentBranchTypeConfig) {
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

                  <div className={EditproductStyle.Text}>מיקום</div>
                  <input
                    type="number"
                    className={EditproductStyle.input}
                    value={
                      branchTypeConfig.length > 0 &&
                      branchTypeConfig[currentBranchTypeConfig - 1].location
                        .index
                        ? branchTypeConfig[currentBranchTypeConfig - 1].location
                            .index
                        : 0
                    }
                    onChange={(e) => {
                      let newConfig = branchTypeConfig.map((config) => {
                        if (config.branchType == currentBranchTypeConfig) {
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
    </>
  );
}

export default EditProduct;
