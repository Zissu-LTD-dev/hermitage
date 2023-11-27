import { useEffect, useState } from "react";
import filtersStyle from "../../assets/css/general/Filters.module.css";
import { useOrderContext } from "../../context/orderContext/OrderContext";

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

function Filters() {
  const { state, dispatch } = useOrderContext();

  const [active, setActive] = useState(false);
  const [filters, setFilters] = useState();

  const getFilters = async () => {
    try {
      const res = await fetch(`${REACT_APP_BACKEND_URL}manager/getFilters`, {
        headers: {
          authorization : `Bearer ${cookie.get("token")}`,
        },
      });
      const data = await res.json();
      console.log(data);

      setFilters(data.filters);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFilter = (e) => {
    console.log(e.target.value);
  }

  useEffect(() => {
    getFilters();
  }, []);

  return (
    <>
      <div
        className={
          active
            ? filtersStyle.filters+" "+filtersStyle.open__filter
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
                        <input type="checkbox" name={detail+index+i} id={detail+index+i} />
                        <label htmlFor={detail+index+i}>{detail.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={filtersStyle.list__submit} >סנן</div>
          </span>
        )}
      </div>
    </>
  );
}

export default Filters;
