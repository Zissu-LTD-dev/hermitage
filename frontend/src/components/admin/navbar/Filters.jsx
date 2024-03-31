import { useEffect, useState, useRef  } from "react";
import filtersStyle from "../../../assets/css/navbar/Filters.module.css";
import { useAdminContext } from "../../../context/adminContext/AdminContext";

function Filters() {
  const { state, dispatch } = useAdminContext();

  const [active, setActive] = useState(false);
  const [filters, setFilters] = useState();
  const [filtersList, setFiltersList] = useState({});
  const [checkedList, setCheckedList] = useState({});
  const [search, setSearch] = useState("");
  const [searchFiltersResults, setSearchFiltersResults] = useState([]);
  
  const wrapperRef = useRef(null);
  const filterRefs = useRef([]);

  const openFilterDetails = (index) => {
    let filterDetails = filterRefs.current[index];
    if (filterDetails.style.display === "none") {
      filterDetails.style.display = "block";
    } else {
      filterDetails.style.display = "none";
    }
  };

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
    if(Object.keys(filtersList).length === 0 && filtersList.constructor === Object) return setActive(false);

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
  }, [state.status]);
  
  // useEffect(() => {
  //   setCheckedList(state.displayFilters);
  //   setFiltersList(state.displayFilters);
  // }, [state.search]);

  useEffect(() => {
    if (state.searchResults != []) {
      setCheckedList({});
    }
  }, [state.searchResults]);

  useEffect(() => {
    if (state.displayFilters.length != 0) {
      dispatch({ type: "SET_SEARCH", payload: "" });
    }
  }, [state.displayFilters]);

  useEffect(() => {
    setCheckedList(state.displayFilters);
    setSearch("");
  }, [active]);

  
  useEffect(() => {
    if (filters) {
      filterRefs.current = filterRefs.current.slice(0, filters.length);
    }
  }, [filters]);

  useEffect(() => {
    if(search !== "") {
      let searchInFilters = filters;
      let results = [];
      searchInFilters.map((filter, i) => {
        // check if title is = סניפים and if so, search by _id
        filter.title == "סניפים" && filter.details.map((detail, j) => {
          String(detail.name).startsWith(String(search)) && results.push(detail.number);
        });
        filter.title != "סניפים" && filter.details.map((detail, j) => {
          String(detail.name).startsWith(String(search)) && results.push(detail.number);
        });
      });
      setSearchFiltersResults(results);
    }else {
      setSearchFiltersResults([]);
    }
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setActive(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <>
      <div
        ref={wrapperRef}
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
              {/* search input */}
              <div className={filtersStyle.list__search}>
                <input
                  type="text"
                  placeholder="חיפוש"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i className={filtersStyle.list__search__icon}></i>
              </div>
              { !searchFiltersResults.length && filters.map((filter, index) => (
                <div className={filtersStyle.list__filter} key={index}>
                  <h5 onClick={() => openFilterDetails(index)}>{filter.title}
                    <i className={filtersStyle.list__filter__icon}></i>
                  </h5>
                  <div style={{ display: "none" }} className={filtersStyle.list__filter__details + " " + `filtersStyle.list__filter__${index}`} ref={el => filterRefs.current[index] = el}>
                    {filter.details.map((detail, i) => (
                      <div
                        className={filtersStyle.list__filter__detail}
                        key={i}
                      >
                        <input
                          {...(checkedList[filter.title] &&
                            checkedList[filter.title].includes(
                              detail.number || detail._id
                            ) && { checked: true })}

                          onClick={() =>
                            filter.title == "סניפים" ? 
                            addFilterToList(filter.title, detail.number) :
                            addFilterToList(filter.title, detail.number)
                          }
                          type="checkbox"
                          name={detail._id + index + i}
                          id={detail._id + index + i}
                        />
                        <label htmlFor={detail._id + index + i}>
                          {detail.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* search results */}
              { searchFiltersResults.length > 0 && filters.map((filter, index) => (
                filter.details.map((detail, i) => (
                  searchFiltersResults.includes(detail.number || detail._id) && (
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
                        filter.title == "סניפים" ?
                        addFilterToList(filter.title, detail.number) :
                        addFilterToList(filter.title, detail.number)
                      }
                      type="checkbox"
                      name={detail._id + index + i}
                      id={detail._id + index + i}
                    />
                    <label htmlFor={detail._id + index + i}>
                      {detail.name}
                    </label>
                  </div>
                  )
                ))
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
