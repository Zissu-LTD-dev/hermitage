import category from "../../assets/css/manager/Category.module.css";
import img from  "../../assets/image/categories/barrel.svg"

function Category( {name, icon, active} ) {
  

  return (
    <>
      <div  className={active ? category.main + " " + category.active : category.main}>
        <div className={category.icon}>
          <img src={img} alt={name} />
        </div>
        <div className={category.name}>{name}</div>
      </div>
    </>
  );
}

export default Category ;
