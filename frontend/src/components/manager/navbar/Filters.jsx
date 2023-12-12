import { useEffect, useState } from "react";
import filtersStyle from "../../../assets/css/navbar/Filters.module.css";
import { useOrderContext } from "../../../context/orderContext/OrderContext";

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

function Filters() {
  const { state, dispatch } = useOrderContext();

  const [active, setActive] = useState(false);
  const [filters, setFilters] = useState();
  const [filtersList, setFiltersList] = useState({});
  const [checkedList, setCheckedList] = useState({});

  const addFilterToList = (name, value) => {
    if (!filtersList[name]) {
      setFiltersList({ ...filtersList, [name]: [value] });
    } else {
      if (filtersList[name].includes(value)) {
        setCheckedList({
          ...checkedList,
          [name]: checkedList[name].filter((item) => item !== value),
        });
        setFiltersList({
          ...filtersList,
          [name]: filtersList[name].filter((item) => item !== value),
        });
      } else {
        setFiltersList({
          ...filtersList,
          [name]: [...filtersList[name], value],
        });
      }
    }
  };

  const handleSubmit = () => {
    
    let isEmpty = false;
    for (const key in filtersList) {
      if (Object.hasOwnProperty.call(filtersList, key)) {
        if (filtersList[key].length > 0) {
          isEmpty = false;
          break;
        } else {
          isEmpty = true;
        }
      }
    }
    if (isEmpty) {
      dispatch({ type: "SET_ACTIVE_FILTERS", payload: [] });
      setActive(false);
      return;
    }

    dispatch({ type: "SET_ACTIVE_FILTERS", payload: filtersList });
    setActive(false);
  };

  useEffect(() => {
    setFilters(state.filters);
  }, [state.filters]);

  useEffect(() => {
    dispatch({ type: "SET_ACTIVE_FILTERS", payload: [] });
    setFiltersList({});
  }, [state.statusOrder]);

  useEffect(() => {
    if (state.displayFilters.length != 0) {
      dispatch({ type: "SET_SEARCH", payload: "" });
    }
  }, [state.displayFilters]);

  useEffect(() => {
    setCheckedList(state.displayFilters);
  }, [active]);

  return (
    <>
      <div
        className={
          active
            ? filtersStyle.filters + " " + filtersStyle.open__filter
            : filtersStyle.filters
        }
      >
        <div className={filtersStyle.filter} onClick={() => setActive(!active)}>
          <h4>סינון</h4>
          <i className={filtersStyle.icon}></i>
        </div>

        {active && (
          <span>
            <div className={filtersStyle.list}>
              {filters.map((filter, index) => (
                <div className={filtersStyle.list__filter} key={index}>
                  <h5>{filter.title}</h5>
                  <div className={filtersStyle.list__filter__details}>
                    {filter.details.map((detail, i) => (
                      <div
                        className={filtersStyle.list__filter__detail}
                        key={i}
                      >
                        <input
                          {...(checkedList[filter.title] &&
                            checkedList[filter.title].includes(
                              detail.number
                            ) && { checked: true })}

                          onClick={() =>
                            addFilterToList(filter.title, detail.number)
                          }
                          type="checkbox"
                          name={detail + index + i}
                          id={detail + index + i}
                        />
                        <label htmlFor={detail + index + i}>
                          {detail.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div onClick={handleSubmit} className={filtersStyle.list__submit}>
              סנן
            </div>
            {/* checkbox cancel all */}
            <div
              className={filtersStyle.list__submit + " " + filtersStyle.cancel}
              onClick={() => {
                dispatch({ type: "SET_ACTIVE_FILTERS", payload: [] });
                setCheckedList({});
                setFiltersList({});
                setActive(false);
              }}
            >
              בטל סינון
            </div>
          </span>
        )}
      </div>
    </>
  );
}

export default Filters;
