import categories from "../../assets/css/manager/Categories.module.css";
import Category from "./Category";

function Categories() {
  const fridge = "snowflake.svg";

  const categoriesList = [
    { name: "א.ח הרמיטאז", icon: "barrel.svg", active: true },
    { name: "קופה - אלכוהול ועישון", icon: fridge, active: false },
    { name: "סיגלו", icon: fridge, active: false },
    { name: "סטנדים יין + לידרים", icon: fridge, active: false },
    { name: "קירות 1-40", icon: fridge, active: false },
    { name: "מקרר", icon: fridge, active: false },
    { name: "מזון", icon: fridge, active: false },
    { name: "מחלקות + אביזרים נלווים", icon: fridge, active: false },
  ];

  return (
    <>
      <div className={categories.categories}>
        {categoriesList.map((category, i) => (
          <Category
            key={i}
            name={category.name}
            icon={category.icon}
            active={category.active}
          />
        ))}
      </div>
    </>
  );
}

export default Categories;
