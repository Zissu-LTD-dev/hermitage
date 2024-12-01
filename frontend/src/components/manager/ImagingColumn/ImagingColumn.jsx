import { useState, useEffect, useRef } from "react";
import Imaging from "../../../assets/css/manager/ImagingColumn/ImagingColumn.module.css";
import shelf from "../../../assets/image/ImagingColumn/Asset 4@4x.png";
import imgProductDefault  from '../../../assets/image/products/000.png';
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;


function ImagingColumn({ name, activeRow, products, openImaging, closeImaging }) {
  const [productsGroup, setProductsGroup] = useState([]);
  const [open, setOpen] = useState(openImaging);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (barcode) => {
    setImageErrors(prev => ({
      ...prev,
      [barcode]: true
    }));
  }


  useEffect(() => {
    let temp = [];
    let group = [];
    if(activeRow){
      products.forEach((product, index) => {
        if (index % 11 === 0 && index !== 0) {
          temp.push(group);
          group = [];
        }
        group.push(product);
      });
    }else{
      let shelfs = [];
      products.forEach((product) => {
        if (!shelfs[product.location.shelf]) {
          shelfs[product.location.shelf] = [];
        }
        shelfs[product.location.shelf].push(product);
      });
      shelfs.forEach((shelf) => {
        let group = [];
        shelf.forEach((product) => {
          group.push(product);
        });
        temp.push(group);
      });
    }
      temp.push(group);
      setProductsGroup(temp);
  }, [products]);

  useEffect(() => {
    setOpen(openImaging);
  }, [openImaging]);

  useEffect(() => {
    if (!open) {
      closeImaging();
    }
  }, [open]);

  return (
    <>
      {open && (
        <div className={Imaging.main}>
          <div className={Imaging.content}>
            <div className={Imaging.header}>
              <div className={Imaging.title}>
                <div className={Imaging.icon}></div>
                <div className={Imaging.name}>עמודה : {name}</div>
              </div>
              <div
                className={Imaging.close}
                onClick={() => setOpen(false)}
              ></div>
            </div>
            <div className={Imaging.body}>
              {productsGroup.map((group, i) => {
                return (
                  <div className={Imaging.group} key={i}>
                    <div className={Imaging.products} key={i}>
                      {group.map((product, index) => {
                        return (
                          <div className={Imaging.product} key={index}>
                            <div className={Imaging.img}>
                              <img 
                                src={imageErrors[product.barcode] ? imgProductDefault : `${REACT_APP_PROJECT_IMAGES}${product.barcode}.png`}
                                alt={name} 
                                onError={() => handleImageError(product.barcode)}
                              />
                            </div>
                            <div className={Imaging.name}>{product.name}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={Imaging.shelf}>
                      <img src={shelf} alt="" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImagingColumn;
