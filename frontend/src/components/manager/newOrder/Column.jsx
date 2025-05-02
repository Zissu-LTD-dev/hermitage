import { useState, useEffect, useRef } from "react";
import column from "../../../assets/css/manager/newOrder/Column.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import ImagingColumn from "../ImagingColumn/ImagingColumn";
import Row from "./Row";
import ProductOrder from "./ProductOrder";
import ProductReturn from "./ProductReturn";

function Column({ details }) {
  const { state, dispatch } = useMainContext();

  let { columnsNumber, columnsName, shelves } = details;

  const [showImaging, setShowImaging] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(false);
  const [products, setProducts] = useState([]);

  const [arrowRight, setArrowRight] = useState(false);
  const [arrowLeft, setArrowLeft] = useState(false);

  const productListRef = useRef(null);
  const columnRef = useRef(null);

  const handleRightClick = () => {
    const { scrollLeft, clientWidth } = productListRef.current;
    const newScrollPosition =
      scrollLeft + clientWidth - 400 > 0 ? 0 : scrollLeft + clientWidth - 400;

    productListRef.current.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  };

  const handleLeftClick = () => {
    const { scrollLeft, clientWidth } = productListRef.current;
    const newScrollPosition = scrollLeft - clientWidth + 400;

    productListRef.current.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });
  };

  const handleColumnOpen = () => {
    setOpen(true);

    // Wait for the column to be available in the DOM
    setTimeout(() => {
      if (columnRef.current) {
        try {
          // Try the simplest approach first
          columnRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });

          // Then add offset for headers by scrolling up a bit
          window.scrollBy({
            top: -180, // Reduced offset to show the column title
            behavior: "smooth",
          });
        } catch (e) {
          // Fallback for older browsers
          const yPosition =
            columnRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, yPosition - 180);
        }
      }
    }, 200); // Longer timeout for more reliable rendering
  };

  useEffect(() => {
    const handleScroll = () => {
      const { scrollWidth, scrollLeft, clientWidth } = productListRef.current;

      if (Math.abs(scrollLeft) + clientWidth + 2 >= scrollWidth) {
        setArrowLeft(false);
        setArrowRight(true);
      } else if (scrollLeft === 0 && scrollWidth - scrollLeft > clientWidth) {
        setArrowLeft(true);
        setArrowRight(false);
      } else {
        setArrowLeft(true);
        setArrowRight(true);
      }
    };
    if (productListRef.current) {
      productListRef.current.scrollWidth > productListRef.current.clientWidth
        ? setArrowLeft(true)
        : setArrowLeft(false);
      setArrowRight(false);

      const productListElement = productListRef.current;
      productListElement.addEventListener("scroll", handleScroll);

      return () => {
        productListElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [open, state.activeCategory]);

  const filterProductsToColumn = (products) => {
    let newProducts = products.filter(
      (product) => product.location.column == columnsNumber
    );

    // sort products by name
    newProducts.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });
    // sort by location.index if location.index is null or undefined posh them to the end
    newProducts.sort((a, b) => {
      if (a.location.index === null || a.location.index === undefined) return 1;
      if (b.location.index === null || b.location.index === undefined)
        return -1;
      return a.location.index - b.location.index;
    });

    return newProducts;
  };

  useEffect(() => {
    let newProducts = filterProductsToColumn(state.displayProducts);
    setProducts(newProducts);
    if (shelves[0].shelvesNumber === "פתוח") {
      setActiveRow(true);
    } else {
      setOpen(false);
    }
  }, [state.activeCategory]);

  return (
    <>
      {!open && (
        <div className={column.main}>
          <span onClick={handleColumnOpen}>
            <i className={column.main__icon}></i>
            <div className={column.title}>{columnsName}</div>
          </span>
          <span>
            {!activeRow && (
              <i
                className={column.imaging}
                onClick={() => setShowImaging(true)}
              >
                <ImagingColumn
                  name={columnsName}
                  activeRow={activeRow}
                  products={products}
                  openImaging={showImaging}
                  closeImaging={() => setShowImaging(false)}
                />
              </i>
            )}
            <i className={column.opening__arrow} onClick={handleColumnOpen}></i>
          </span>
        </div>
      )}

      {open && (
        <div className={column.main__open} ref={columnRef}>
          <div className={column.main}>
            <span onClick={() => setOpen(false)}>
              <i className={column.main__icon}></i>
              <div className={column.title}>{columnsName}</div>
            </span>
            <span>
              {!activeRow && (
                <i
                  className={column.imaging}
                  onClick={() => setShowImaging(true)}
                >
                  <ImagingColumn
                    name={columnsName}
                    activeRow={activeRow}
                    products={products}
                    openImaging={showImaging}
                    closeImaging={() => setShowImaging(false)}
                  />
                </i>
              )}
              <i
                className={column.closing__arrow}
                onClick={() => setOpen(false)}
              ></i>
            </span>
          </div>

          {!activeRow && (
            <div className={column.rows}>
              {shelves.map((row, i) => (
                <Row
                  key={`${state.activeCategory}-${columnsNumber}-${i}`}
                  details={row}
                  productsList={products}
                />
              ))}
            </div>
          )}

          {activeRow && (
            <div className={column.products_list}>
              {products.length > 0 ? (
                products.map((product, i) => {
                  return (
                    <ProductOrder key={product.barcode} productData={product} />
                  );
                })
              ) : (
                <h2>אין מוצרים במדף</h2>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Column;
