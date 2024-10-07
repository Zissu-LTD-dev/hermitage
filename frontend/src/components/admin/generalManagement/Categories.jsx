import { useEffect, useState } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import generalManagementStyles from "../../../assets/css/admin/generalManagement/SubGeneralManagement.module.css";
import apiRequestForForm from "../../../services/apiForForm";

function Category() {
  const { state: mainState, dispatch: mainDispatch } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const initialState = {
    name: "",
    number: 0,
  };

  const [newCategory, setNewCategory] = useState(initialState);
  const [categories, setCategories] = useState([]);

  const [addCategory, setAddCategory] = useState(false);
  const [editCategory, setEditCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState([]);

  const addCategoryHandler = async () => {
    let categoryNumberExists = state.categories.find(category => category.number === newCategory.number);
    if(categoryNumberExists){
        mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "מספר קטגוריה כבר קיים"} });
        return;
    }
    let response = await apiRequestForForm("admin/addCategory", "POST", newCategory);
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "הוספת קטגוריה נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "הוספת קטגוריה בוצעה בהצלחה"} });
      state.categories.push(newCategory);
      state.categories.sort((a, b) => a.number - b.number);
    }
    setNewCategory(initialState);
    setAddCategory(false);
  }

  const editCategoryHandler = () => {
    let response = apiRequestForForm(`admin/editCategory/${newCategory._id}`, "PUT", newCategory);
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "עריכת קטגוריה נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "עריכת קטגוריה בוצעה בהצלחה"} });
      let index = state.categories.findIndex(category => category._id === newCategory._id);
      state.categories[index] = newCategory;
      state.categories.sort((a, b) => a.number - b.number);
    }
    setNewCategory(initialState);
    setEditCategory(false);
  }

  // delete category
  const deleteCategoryHandler = async (id) => {
    let response = await apiRequestForForm(`admin/deleteCategory/${id}`, "DELETE");
    if(response.error){
      mainDispatch({ type: "SET_SHOW_ERROR", payload: {show: true, message: "מחיקת הקטגוריה נכשלה"} });
      return;
    }else{
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: {show: true, message: "מחיקת הקטגוריה בוצעה "} });
      let index = state.categories.findIndex(category => category._id === id);
      state.categories.splice(index, 1);
    }
  }


  useEffect(() => {
    let tempCategories = [];
    state.products.forEach(product => {
      if(!tempCategories.find(category => category === product.category)){
        product.category && tempCategories.push(product.category);
      }
    });
    setCurrentCategory(tempCategories);
  }, [state.products])

  useEffect(() => {
    // sort categories by number
    state.categories.sort((a, b) => a.number - b.number);
    setCategories(state.categories);
  }, [state.categories])

  return (
    <>
      <div className={generalManagementStyles.main}>
        <div className={generalManagementStyles.header}>
          <div className={generalManagementStyles.title}>קטגוריות</div>
          <div className={generalManagementStyles.headerButtons}>
            <div
              className={generalManagementStyles.headerButton}
              onClick={() => setAddCategory(true)}
            >
              הוסף קטגוריה
            </div>
          </div>
        </div>
        <div className={generalManagementStyles.body}>
          {addCategory && (
            <>
              <div className={generalManagementStyles.formFields}>
                <div className={generalManagementStyles.formFieldsTitle}>
                  הוספת קטגוריה
                </div>
                <div className={generalManagementStyles.formFieldsForm}>
                  <div className={generalManagementStyles.formFieldsInput}>
                    <label>שם קטגוריה</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                    />
                  </div>
                  <div className={generalManagementStyles.formFieldsInput}>
                    <label>מספר קטגוריה</label>
                    <input
                      type="number"
                      value={newCategory.number}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, number: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className={generalManagementStyles.formFieldsButtons}>
                    <div
                      className={
                        generalManagementStyles.formFieldsButton +
                        " " +
                        generalManagementStyles.cancelButton
                      }
                      onClick={() => {
                        setAddCategory(false);
                        setNewCategory(initialState);
                      }}
                    >
                      ביטול
                    </div>
                    <div
                      className={
                        generalManagementStyles.formFieldsButton +
                        " " +
                        generalManagementStyles.addButton
                      }
                      onClick={() => addCategoryHandler()}
                    >
                      הוספה
                    </div>
                  </div>
              </div>
            </>
          )}
          {editCategory && (
            <>
              <div className={generalManagementStyles.formFields}>
                <div className={generalManagementStyles.formFieldsTitle}>
                  עריכת קטגוריה
                </div>
                <div className={generalManagementStyles.formFieldsForm}>
                  <div className={generalManagementStyles.formFieldsInput}>
                    <label>שם קטגוריה</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className={generalManagementStyles.formFieldsButtons}>
                  <div
                    className={
                      generalManagementStyles.formFieldsButton +
                      " " +
                      generalManagementStyles.cancelButton
                    }
                    onClick={() => {
                      setEditCategory(false);
                      setNewCategory(initialState);
                    }}
                  >
                    ביטול
                  </div>
                  <div
                    className={
                      generalManagementStyles.formFieldsButton +
                      " " +
                      generalManagementStyles.addButton
                    }
                    onClick={() => editCategoryHandler()}
                  >
                    עריכה
                  </div>
                </div>
              </div>
            </>
          )}
          {!addCategory && !editCategory && (
            <>
              {categories.length && (
                categories.map((category, index) => (
                <div key={index} className={generalManagementStyles.list}>
                  <div className={generalManagementStyles.listTitle}>
                    {category.name}
                  </div>
                  <div className={generalManagementStyles.listDetails}>
                    <div className={generalManagementStyles.listDetail}>
                      מספר: {category.number}
                    </div>
                  </div>
                  <div className={generalManagementStyles.listButtons}>
                    <div
                      className={
                        generalManagementStyles.listButton +
                        " " +
                        generalManagementStyles.editButton
                      }
                      onClick={() => {
                        setEditCategory(true);
                        setNewCategory(category);
                      }}
                    >
                      עריכה
                    </div>
                    {!currentCategory.includes(category.number) && (
                      <div
                        className={
                          generalManagementStyles.listButton +
                          " " +
                          generalManagementStyles.deleteButton
                        }
                        onClick={() => deleteCategoryHandler(category._id)}
                      >
                        מחיקה
                      </div>
                      )}
                  </div>
                </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Category;