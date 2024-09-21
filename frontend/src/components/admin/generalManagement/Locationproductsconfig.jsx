import { useEffect, useState } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import locationProductsConfigStyles from "../../../assets/css/admin/generalManagement/LocationProductsConfig.module.css";
import apiRequestForForm from "../../../services/apiForForm";

function LocationProductsConfig() {
    const { state: mainState, dispatch: mainDispatch } = useMainContext();
    const { state, dispatch } = useAdminContext();

    const [locationProductsConfig, setLocationProductsConfig] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [confirmationDelete, setConfirmationDelete] = useState(null);

    const getLocationProductsConfig = async () => {
        let response = await apiRequestForForm("admin/locationProductsConfig", "GET");
        if (response.error) {
            mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "שגיאה בטעינת הנתונים" } });
            return;
        } else {
            mainDispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הנתונים נטענו בהצלחה" } });
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
        editedData.categoryName = categories.find((category) => category.number == editedData.categoryNumber)?.name;
        if (editedData.shelvesNumber.match(/^[0-9]+$/) == null || parseInt(editedData.shelvesNumber) <= 0) {
            editedData.shelvesNumber = "פתוח";
        }else{
            let shelvesString = "";
            for (let i = 1; i <= parseInt(editedData.shelvesNumber); i++) {
                shelvesString += "," + i;
            }
            shelvesString = shelvesString.substring(1);
            editedData.shelvesNumber = shelvesString;
        }
        
        let categoryList = locationProductsConfig.filter((item) => item.categoryNumber == editedData.categoryNumber);
        let columnsList = categoryList.filter((item) => item.columnsNumber == editedData.columnsNumber);
        if(columnsList.length > 0){
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

        const updatedConfig = [...locationProductsConfig];
        updatedConfig[index] = editedData;
        setLocationProductsConfig(updatedConfig);
        setEditingIndex(null);
        setEditedData({});
    };

    const handleDelete = async (index) => {
        // TODO: send delete request to the server
        // let response = await apiRequestForForm("admin/deleteLocationProductsConfig/" + locationProductsConfig[index]._id, "DELETE");
        // if (response.error) {
        //     mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "שגיאה במחיקת הנתונים" } });
        //     return;
        // } else {
        //     mainDispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הנתונים נמחקו בהצלחה" } });
        // }
        setConfirmationDelete(null);
        const updatedConfig = locationProductsConfig.filter((_, i) => i !== index);
        setLocationProductsConfig(updatedConfig);
    };

    const handleAdd = () => {
        const newEntry = {
            _id: { $oid: new Date().toISOString() },
            categoryNumber: "",
            categoryName: "",
            columnsNumber: "",
            columnsName: "",
            shelvesNumber: "",
            shelvesName: "",
            v: 0,
        };
        setLocationProductsConfig([...locationProductsConfig, newEntry]);
        setEditingIndex(locationProductsConfig.length);
        setEditedData(newEntry);
    };

    return (
        <div className={locationProductsConfigStyles.container}>
            <button onClick={handleAdd} className={locationProductsConfigStyles.addButton}>הוסף חדש</button>

            {/* כותרות בעברית מעל השורות */}
            <div className={locationProductsConfigStyles.headers}>
                <span>מספר קטגוריה</span>
                <span>שם קטגוריה</span>
                <span>מספר עמודות</span>
                <span>שם עמודות</span>
                <span>מספר מדפים</span>
                <span>שם מדפים</span>
                <button className={locationProductsConfigStyles.emptyButton}>ערוך</button>
                <button className={locationProductsConfigStyles.emptyButton}>מחק        </button>
            </div>

            {/* רשימת המוצרים */}
            <div className={locationProductsConfigStyles.scrollableContainer}>
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
                                    value={editedData.shelvesName}
                                    onChange={(e) => setEditedData({ ...editedData, shelvesName: e.target.value })}
                                    className={locationProductsConfigStyles.input}
                                />
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
                                <span>{item.shelvesName}</span>
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
