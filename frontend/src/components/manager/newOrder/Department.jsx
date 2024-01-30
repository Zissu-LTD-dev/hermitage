import department from "../../../assets/css/manager/newOrder/Department.module.css";
import barrel from  "../../../assets/image/categories/barrel.svg"
import snowflake from  "../../../assets/image/categories/snowflake.svg"
import food from  "../../../assets/image/categories/11-food.svg"
import sigar from  "../../../assets/image/categories/Group39.svg"
import shelves from  "../../../assets/image/categories/Layer5.svg"

function Category( {num, name, icon, active, changeActive} ) {
  switch (num) {
    case 1:
      icon = barrel ;
      break;
    case 2:
      icon = sigar;
      break;
    case 3:
      icon = sigar;
      break;
    case 4:
      icon = barrel;
      break;
    case 5:
      icon = shelves;
      break;
    case 6:
      icon = snowflake;
      break;
    case 7:
      icon = food;
      break;
    case 8:
      icon = snowflake;
      break;
    case 9:
      icon = shelves;
      break;
     }

  return (
    <>
      <div className={active ? department.main + " " + department.active : department.main}>
        <div className={department.icon}>
          <img src={icon} />
        </div>
        <div className={department.name}>{name}</div>
      </div>
    </>
  );
}

export default Category ;
