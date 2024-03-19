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
          <span onClick={() => setOpen(true)}>
            <i className={column.main__icon}></i>
            <div className={column.title}>{columnsName}</div>
          </span>
          <span>
            <i className={column.imaging} onClick={() => setShowImaging(true)}>
              {/* <ImagingColumn name={name} products={products} openImaging={showImaging} closeImaging={() => setShowImaging(false)} /> */}
            </i>
            <i
              className={column.opening__arrow}
              onClick={() => setOpen(true)}
            ></i>
          </span>
        </div>
      )}

      {open && (
        <div className={column.main__open}>
          <div className={column.main}>
            <span onClick={() => setOpen(false)}>
              <i className={column.main__icon}></i>
              <div className={column.title}>{columnsName}</div>
            </span>
            <span>
              <i
                className={column.imaging}
                onClick={() => setShowImaging(true)}
              >
                {/* <ImagingColumn name={name} products={products} openImaging={showImaging} closeImaging={() => setShowImaging(false)} /> */}
              </i>
              <i
                className={column.closing__arrow}
                onClick={() => setOpen(false)}
              ></i>
            </span>
          </div>

          {!activeRow && (
            <div className={column.rows}>
              {shelves.map((row, i) => (
                <Row key={i} details={row}  productsList={products} />
              ))}
            </div>
          )}

          {activeRow && (
            <div className={column.products_list}>
              {products.length > 0 ? (
                products.map((product, i) => {
                  return <ProductOrder key={i} productData={product} />;
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
