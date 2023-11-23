import { useState } from "react";
import filtersStyle from "../../assets/css/general/Filters.module.css";

function Filters() {
  const [active, setActive] = useState(false);

  const filters = [
    {
      title: "ספק",
      details: ["Bella1", "Bella2", "Bella3"],
    },
    {
      title: "סוג",
      details: ["Bella1", "Bella2", "Bella3"],
    },
    {
      title: "סוג",
      details: ["Bella1", "Bella2", "Bella3"],
    },
    {
      title: "סוג",
      details: ["Bella1", "Bella2", "Bella3"],
    },
    {
      title: "סוג",
      details: ["Bella1", "Bella2", "Bella3"],
    },
  ];

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
                        <label htmlFor={detail+index+i}>{detail}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={filtersStyle.list__submit}>סנן</div>
          </span>
        )}
      </div>
    </>
  );
}

export default Filters;
