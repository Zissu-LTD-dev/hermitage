import { useEffect, useState, useRef } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import locationProductsConfigStyles from "../../../assets/css/admin/generalManagement/LocationProductsConfig.module.css";
import apiRequestForForm from "../../../services/apiForForm";

function LocationProductsConfig() {
    const { state: mainState, dispatch: mainDispatch } = useMainContext();
    const { state, dispatch } = useAdminContext();

    const newRowRef = useRef(null);

    const [locationProductsConfig, setLocationProductsConfig] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [confirmationDelete, setConfirmationDelete] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newData, setNewData] = useState({
        categoryNumber: "",
        categoryName: "",
        columnsNumber: "",
        columnsName: "",
        shelvesNumber: "",
        shelvesName: "",
    });

    const sortLocationProductsConfig = (data) => {
        return data.sort((a, b) => {
          // קודם כל, מיון לפי מספר קטגוריה
          if (a.categoryNumber !== b.categoryNumber) {
            return a.categoryNumber - b.categoryNumber;
          }
          
          // אם מספרי הקטגוריה זהים, מיין לפי מספר עמודה
          if (a.columnsNumber !== b.columnsNumber) {
            return a.columnsNumber - b.columnsNumber;
          }
          
          // אם גם מספרי העמודה זהים, מיין לפי מספר מדף
          return a.shelvesNumber.localeCompare(b.shelvesNumber, undefined, {numeric: true, sensitivity: 'base'});
        });
      };

    const getLocationProductsConfig = async () => {
        let response = await apiRequestForForm("admin/locationProductsConfig", "GET");
        if (response.error) {
            mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "שגיאה בטעינת הנתונים" } });
            return;
        } else {
            mainDispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הנתונים נטענו בהצלחה" } });
            response.locationProductsConfig = sortLocationProductsConfig(response.locationProductsConfig);
            setLocationProductsConfig(response.locationProductsConfig);
        }
    };

    useEffect(() => {
        getLocationProductsConfig();
    }, []);

    useEffect(() => {
        setCategories(state.categories);
    }, [state.categories]);

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditedData(locationProductsConfig[index]);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditedData({});
    };

    const handleSave = async (index) => {
        // validate editedData
        if (editedData.categoryNumber === "" || editedData.columnsNumber === "" || editedData.columnsName === "") {
            mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "יש למלא את כל השדות" } });
            return;
        }
        editedData.categoryName = categories.find((category) => category.number == editedData.categoryNumber)?.name;
        if (editedData.shelvesNumber.match(/^[0-9]+$/) == null || parseInt(editedData.shelvesNumber) <= 0) {
            editedData.shelvesNumber = "פתוח";
        } else {
            let shelvesString = "";
            for (let i = 1; i <= parseInt(editedData.shelvesNumber); i++) {
                shelvesString += "," + i;
            }
            shelvesString = shelvesString.substring(1);
            editedData.shelvesNumber = shelvesString;
        }
        
        let categoryList = locationProductsConfig.filter((item) => item.categoryNumber == editedData.categoryNumber);
        let columnsList = categoryList.filter((item) => item.columnsNumber == editedData.columnsNumber && item._id !== editedData._id);
        if (columnsList.length > 0) {
            mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "מספר העמודה כבר קיים בקטגוריה זו" } });
            return;
        }

        // send editedData to the server
        let response = await apiRequestForForm("admin/editLocationProductsConfig/" + editedData._id, "PUT", editedData);
        if (response.error) {
            mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "שגיאה בעדכון הנתונים" } });
            return;
        } else {
            mainDispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הנתונים עודכנו בהצלחה" } });
        }

        const updatedConfig = sortLocationProductsConfig([...locationProductsConfig.filter(item => item._id !== editedData._id), editedData]);
        setLocationProductsConfig(updatedConfig);
        setEditingIndex(null);
        setEditedData({});
    };

    const handleDelete = async (index) => {
        let response = await apiRequestForForm("admin/deleteLocationProductsConfig/" + locationProductsConfig[index]._id, "DELETE");
        if (response.error) {
            mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "שגיאה במחיקת הנתונים" } });
            return;
        } else {
            mainDispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הנתונים נמחקו בהצלחה" } });
        }
        setConfirmationDelete(null);
        const updatedConfig = locationProductsConfig.filter((_, i) => i !== index);
        setLocationProductsConfig(updatedConfig);
    };

    const handleAdd = () => {
        setIsAddingNew(true);
        setNewData({
            categoryNumber: "",
            categoryName: "",
            columnsNumber: "",
            columnsName: "",
            shelvesNumber: "",
            shelvesName: "",
        });
    };

    const handleSaveNew = async () => {
        // Validate newData
        if (newData.categoryNumber === "" || newData.columnsNumber === "" || newData.columnsName === "") {
            mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "יש למלא את כל השדות" } });
            return;
        }
        newData.categoryName = categories.find((category) => category.number == newData.categoryNumber)?.name;
        if (newData.shelvesNumber.match(/^[0-9]+$/) == null || parseInt(newData.shelvesNumber) <= 0) {
            newData.shelvesNumber = "פתוח";
        } else {
            let shelvesString = "";
            for (let i = 1; i <= parseInt(newData.shelvesNumber); i++) {
                shelvesString += "," + i;
            }
            shelvesString = shelvesString.substring(1);
            newData.shelvesNumber = shelvesString;
        }
        
        let categoryList = locationProductsConfig.filter((item) => item.categoryNumber == newData.categoryNumber);
        let columnsList = categoryList.filter((item) => item.columnsNumber == newData.columnsNumber);
        if (columnsList.length > 0) {
            mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "מספר העמודה כבר קיים בקטגוריה זו" } });
            return;
        }

        // Send newData to the server
        let response = await apiRequestForForm("admin/addLocationProductsConfig", "POST", newData);
        if (response.error) {
            mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "שגיאה בהוספת הנתונים" } });
            return;
        } else {
            mainDispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הנתונים נוספו בהצלחה" } });
        }
        newData._id = response._id;

        const updatedConfig = sortLocationProductsConfig([...locationProductsConfig, newData]);
        setLocationProductsConfig(updatedConfig);        setIsAddingNew(false);
        setNewData({});
    };

    const handleCancelNew = () => {
        setIsAddingNew(false);
        setNewData({});
    };

    useEffect(() => {
        if (isAddingNew && newRowRef.current) {
            newRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isAddingNew]);

    return (
        <div className={locationProductsConfigStyles.container}>
            <button onClick={handleAdd} className={locationProductsConfigStyles.addButton}>הוסף חדש</button>

            {/* כותרות בעברית מעל השורות */}
            <div className={locationProductsConfigStyles.headers}>
                <span>מספר קטגוריה</span>
                <span>שם קטגוריה</span>
                <span>מספר עמודה</span>
                <span>שם עמודה</span>
                <span>מספר מדף</span>
                <span></span>
                <button className={locationProductsConfigStyles.emptyButton}>ערוך</button>
                <button className={locationProductsConfigStyles.emptyButton}>מחק</button>
            </div>

            {/* רשימת המוצרים */}
            <div className={locationProductsConfigStyles.scrollableContainer}>
                {isAddingNew && (
                    <>
                    <div ref={newRowRef} className={locationProductsConfigStyles.headers}>
                        <h3>
                            הוספת עמודה חדשה : 
                        </h3>
                    </div>
                    <div className={locationProductsConfigStyles.row}>
                        <input
                            disabled
                            type="text"
                            value={newData.categoryNumber}
                            onChange={(e) => setNewData({ ...newData, categoryNumber: e.target.value })}
                            placeholder="מספר קטגוריה"
                            className={locationProductsConfigStyles.input}
                            ></input>

                        <select
                            value={newData.categoryNumber}
                            onChange={(e) => setNewData({ ...newData, categoryNumber: e.target.value })}
                            className={locationProductsConfigStyles.input}
                        >
                            <option value="">בחר קטגוריה</option>
                            {categories.map((category) => (
                                <option key={category.number} value={category.number}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={newData.columnsNumber}
                            onChange={(e) => setNewData({ ...newData, columnsNumber: e.target.value })}
                            placeholder="מספר עמודה"
                            className={locationProductsConfigStyles.input}
                        />
                        <input
                            type="text"
                            value={newData.columnsName}
                            onChange={(e) => setNewData({ ...newData, columnsName: e.target.value })}
                            placeholder="שם עמודה"
                            className={locationProductsConfigStyles.input}
                        />
                        <input
                            type="text"
                            value={newData.shelvesNumber}
                            onChange={(e) => setNewData({ ...newData, shelvesNumber: e.target.value })}
                            placeholder="מספר מדף"
                            className={locationProductsConfigStyles.input}
                        />
                        <input 
                            type="text"
                            value=''
                            disabled
                            style={{border: 'none'}}
                        ></input>
                        <button onClick={handleSaveNew} className={locationProductsConfigStyles.saveButton}>שמור</button>
                        <button onClick={handleCancelNew} className={locationProductsConfigStyles.cancelButton}>בטל</button>
                    </div>
                    <hr />
                    </>
                )}
                {locationProductsConfig.map((item, index) => (
                    <div key={item._id} className={locationProductsConfigStyles.row}>
                        {editingIndex === index ? (
                            <>
                                <input
                                    disabled
                                    type="text"
                                    value={editedData.categoryNumber}
                                    onChange={(e) => setEditedData({ ...editedData, categoryNumber: e.target.value })}
                                    className={locationProductsConfigStyles.input}
                                />
                                <select
                                    value={editedData.categoryNumber}
                                    onChange={(e) => setEditedData({ ...editedData, categoryNumber: e.target.value })}
                                    className={locationProductsConfigStyles.input}
                                >
                                    {categories.map((category) => (
                                        <option key={category.number} value={category.number}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={editedData.columnsNumber}
                                    onChange={(e) => setEditedData({ ...editedData, columnsNumber: e.target.value })}
                                    className={locationProductsConfigStyles.input}
                                />
                                <input
                                    type="text"
                                    value={editedData.columnsName}
                                    onChange={(e) => setEditedData({ ...editedData, columnsName: e.target.value })}
                                    className={locationProductsConfigStyles.input}
                                />
                                <input
                                    type="text"
                                    value={editedData.shelvesNumber}
                                    onChange={(e) => setEditedData({ ...editedData, shelvesNumber: e.target.value })}
                                    className={locationProductsConfigStyles.input}
                                />
                                <input
                                    type="text"
                                    value=''
                                    disabled
                                    style={{border: 'none'}}
                                ></input>
                                <button onClick={() => handleSave(index)} className={locationProductsConfigStyles.saveButton}>שמור</button>
                                <button onClick={handleCancel} className={locationProductsConfigStyles.cancelButton}>בטל</button>
                            </>
                        ) : (
                            <>
                                <span>{item.categoryNumber}</span>
                                <span>{categories.find((category) => category.number == item.categoryNumber)?.name}</span>
                                <span>{item.columnsNumber}</span>
                                <span>{item.columnsName}</span>
                                <span>{item.shelvesNumber}</span>
                                <span></span>
                                <button onClick={() => handleEdit(index)} className={locationProductsConfigStyles.editButton}>ערוך</button>
                                <button onClick={() => setConfirmationDelete(index)} className={locationProductsConfigStyles.deleteButton}>מחק</button>
                                {confirmationDelete === index && (
                                    <div className={locationProductsConfigStyles.confirmDelete}>
                                        <button onClick={() => handleDelete(index)} className={locationProductsConfigStyles.confirmDeleteButton}>אישור מחיקה</button>
                                        <button onClick={() => setConfirmationDelete(null)} className={locationProductsConfigStyles.cancelDeleteButton}>ביטול</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LocationProductsConfig;