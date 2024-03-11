import { useState, useEffect, useRef } from "react";
import column from "../../../assets/css/manager/newOrder/Column.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import ImagingColumn from "../ImagingColumn/ImagingColumn";
import Row from "./Row";
import ProductOrder from "./ProductOrder";
import ProductReturn from "./ProductReturn";

function Column({ name, num, products }) {
  const { state, dispatch } = useMainContext();

  const [showImaging, setShowImaging] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(false);

  const [arrowRight, setArrowRight] = useState(false);
  const [arrowLeft, setArrowLeft] = useState(false);

  const productListRef = useRef(null);

  const handleRightClick = () => {
    const { scrollLeft, clientWidth } = productListRef.current;
    const newScrollPosition = scrollLeft + clientWidth - 400 > 0 ? 0 : scrollLeft + clientWidth - 400;
    
    productListRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  const handleLeftClick = () => {
    const { scrollLeft, clientWidth } = productListRef.current;
    const newScrollPosition = scrollLeft - clientWidth + 400;

    productListRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const { scrollWidth,  scrollLeft,  clientWidth,  } = productListRef.current;

      if(Math.abs(scrollLeft) + clientWidth +2 >= scrollWidth){
        setArrowLeft(false);
        setArrowRight(true);
      } else if(scrollLeft === 0 && scrollWidth - scrollLeft > clientWidth){
        setArrowLeft(true);
        setArrowRight(false);
      } else {
        setArrowLeft(true);
        setArrowRight(true);
      }
    };  
      if(productListRef.current){

        productListRef.current.scrollWidth > productListRef.current.clientWidth ? setArrowLeft(true) : setArrowLeft(false);
        setArrowRight(false);
        

        const productListElement = productListRef.current;
        productListElement.addEventListener("scroll", handleScroll);
        
        return () => {
          productListElement.removeEventListener("scroll", handleScroll);
        };
      }
  }, [open, state.activeCategory]);

  useEffect(() => {
    setOpen(false);
  }, [state.activeCategory]);

  return (
    <>
      {!open && (
        <div className={column.main} >
          <span onClick={() => setOpen(true)} >
            <i className={column.main__icon}></i>
            <div className={column.title}>עמודה: {name}</div>
          </span>
          <span>
            <i className={column.imaging} onClick={() => setShowImaging(true)}>
              {/* <ImagingColumn name={name} products={products} openImaging={showImaging} closeImaging={() => setShowImaging(false)} /> */}
            </i>
            <i className={column.opening__arrow} onClick={() => setOpen(true)}></i>
          </span>
        </div>
      )}

      {open && (
        <div className={column.main__open} >
          <div className={column.main} >
            <span onClick={() => setOpen(false)}>
              <i className={column.main__icon}></i>
              <div className={column.title}>עמודה: {name}</div>
            </span>
            <span>
              <i className={column.imaging} onClick={() => setShowImaging(true)}>
                <ImagingColumn name={name} products={products} openImaging={showImaging} closeImaging={() => setShowImaging(false)} />
              </i>
              <i className={column.closing__arrow} onClick={() => setOpen(false)} ></i>
            </span>
          </div>

          {activeRow && (
            <div className={column.rows}>
              {products.map((product, i) => (
                <Row key={i} product={product} />
              ))}
            </div>
          )}

          {!activeRow && (
            <>
              <div className={column.products_list} ref={productListRef}>
                {products.map((product, i) => (
                  <ProductOrder key={i} productData={product} />
                ))}
              </div>

              {arrowRight && 
                <div className={column.arrow_right} onClick={handleRightClick}>
                  <i className={column.arrow_icon_right}></i>
                </div>
              }
              {arrowLeft && 
                <div className={arrowLeft && arrowRight ? column.arrow_left + " " + column.arrow_up : column.arrow_left} onClick={handleLeftClick}>
                  <i className={column.arrow_icon_left}></i>
                </div>
              }
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Column;
