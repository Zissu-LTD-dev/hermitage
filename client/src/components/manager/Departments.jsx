import { useState , useEffect } from "react";
import { useOrderContext } from "../../context/orderContext/OrderContext";
import departments from "../../assets/css/manager/Departments.module.css";
import Department from "./Department";

function Departments() {

  const { state, dispatch } = useOrderContext();

  const [departmentsList, setDepartmentsList] = useState([
    { num: 1, name: "א.ח הרמיטאז",              icon: "", active: true },
    { num: 2, name: "קופה - אלכוהול ועישון",   icon: "", active: false },
    { num: 3, name: "סיגלו",                    icon: "", active: false },
    { num: 4, name: "סטנדים יין + לידרים",     icon: "", active: false },
    { num: 5, name: "קירות 1-40",               icon: "", active: false },
    { num: 6, name: "מקרר",                     icon: "", active: false },
    { num: 7, name: "מזון",                     icon: "", active: false },
    { num: 8, name: "מחלקות + אביזרים נלווים", icon: "", active: false },
  ]);

  const changeActive = (num) => {
    dispatch({ type: "SET_ACTIVE_DEPARTMENT", payload: num });
     setDepartmentsList(departmentsList.map((item) => (item.num === num ? {...item, active: true} : {...item, active: false} )));
  }

  useEffect(() => {
    changeActive(state.activeDepartment);
  },[]);

  return (
    <>
      <div className={departments.categories}>
        {departmentsList.map((category, i) => (
          <span key={i} onClick={() => changeActive(category.num)}> 
            <Department
              key={i}
              num={category.num}
              name={category.name}
              icon={category.icon}
              active={category.active}
              />
            </span>
        ))}
      </div>
    </>
  );
}

export default Departments;
