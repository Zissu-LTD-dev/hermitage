import { useState, useEffect } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import categoriesStyle from "../../../assets/css/manager/newOrder/Categories.module.css";
import Category from "./Category";

function Categories() {
  const { state, dispatch } = useMainContext();

  const [categoryList, setCategoryList] = useState([]);

  const changeActive = (num) => {
    dispatch({ type: "SET_ACTIVE_CATEGORY", payload: num });
    dispatch({ type: "SET_DISPLAY_PRODUCTS" });
  };
  
  useEffect(() => {
    if (state.categories.length > 0) {
      let newCategories = state.categories.filter((category) => category.number !== 10);
      newCategories = newCategories.map((category) => {
        return {
          num: category.number,
          name: category.name,
        };
      });
      // sort categories by number
      newCategories.sort((a, b) => a.num - b.num);
      setCategoryList(newCategories);
      changeActive(1);
    }
  }, [state.categories]);

  return (
    <>
      <div className={categoriesStyle.categories}>
        {categoryList.map((category, i) => (
          <span key={i} onClick={() => changeActive(category.num)}>
            <Category
              key={i}
              num={category.num}
              name={category.name}
              icon={category.icon}
            />
          </span>
        ))}
      </div>
    </>
  );
}

export default Categories;
