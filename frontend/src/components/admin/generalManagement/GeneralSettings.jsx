import { useState } from 'react'
import generalSettings from '../../../assets/css/admin/generalManagement/GeneralSettings.module.css'
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import apiRequestForForm from "../../../services/apiForForm";

function GeneralSettings() {
  const { state } = useAdminContext();
  const { state: mainState, dispatch: mainDispatch } = useMainContext();
  const { providers } = state;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState([]);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    setSelectedProviders([]);
  };

  const handleProviderSelect = (providerId) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProviders(providers.map(p => p._id));
  };

  const handleSendReport = async () => {
    mainDispatch({ type: "SET_SHOW_LOADER", payload: true });
    try {
      await apiRequestForForm(
        "admin/sendProviderReport",
        "POST",
        { selectedProviders }
      );
      mainDispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "דוח נשלח בהצלחה" } });
      setIsPopupOpen(false);
      setSelectedProviders([]);
    } catch (error) {
      console.error('Error sending provider report:', error);
        mainDispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "שגיאה בשליחת הדוח" } });
    }
    mainDispatch({ type: "SET_SHOW_LOADER", payload: false });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProviders([]);
  };

  return (
    <div className={generalSettings.container}>
      <div className={generalSettings.headers}>
        <div className={generalSettings.title}>הגדרות כלליות</div>
      </div>
      <div className={generalSettings.body}>
        <div className={generalSettings.sendReportSection}>
          <div className={generalSettings.title}>שלח דוח מוצרים לספקים</div>
          <button 
            className={generalSettings.sendReportButton} 
            onClick={handleOpenPopup}
          >
            שלח דוח
          </button>
        </div>

        {isPopupOpen && (
          <div className={generalSettings.popup}>
            <div className={generalSettings.popupContent}>
              <div className={generalSettings.popupHeader}>
                <h2 className={generalSettings.popupHeaderTitle}>בחירת ספקים לשליחת דוח</h2>
                <button 
                  className={generalSettings.selectAllButton}
                  onClick={handleSelectAll}
                >
                  בחר הכל
                </button>
              </div>
              <div className={generalSettings.providerList}>
                {providers.map(provider => (
                  <div 
                    key={provider._id} 
                    className={generalSettings.providerItem}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedProviders.includes(provider._id)}
                      onChange={() => handleProviderSelect(provider._id)}
                    />
                    <span>{provider.name} - {provider.number}</span>
                  </div>
                ))}
              </div>
              <div className={generalSettings.popupButtons}>
                <button 
                  className={generalSettings.sendButton}
                  onClick={handleSendReport}
                >
                  שלח
                </button>
                <button 
                  className={generalSettings.cancelButton}
                  onClick={handleClosePopup}
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GeneralSettings