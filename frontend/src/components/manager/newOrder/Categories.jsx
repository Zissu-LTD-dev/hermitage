import { useState, useEffect } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import categoriesStyle from "../../../assets/css/manager/newOrder/Categories.module.css";
import Category from "./Category";

function Categories() {
  const { state, dispatch } = useMainContext();

  const [categoryList, setCategoryList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const changeActive = (num) => {
    dispatch({ type: "SET_ACTIVE_CATEGORY", payload: num });
    setCategoryList(
      categoryList.map((item) =>
        item.num === num
          ? { ...item, active: true }
          : { ...item, active: false }
      )
    );
    dispatch({ type: "SET_DISPLAY_PRODUCTS" });
  };

  useEffect(() => {
    changeActive(state.activeCategory);
  }, [isLoaded]);

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
      if(categoryList.length > 0) setIsLoaded(true);
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
              active={category.active}
            />
          </span>
        ))}
      </div>
    </>
  );
}

export default Categories;
