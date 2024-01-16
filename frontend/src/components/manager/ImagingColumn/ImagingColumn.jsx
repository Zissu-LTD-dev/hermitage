import { useState, useEffect } from "react";
import Imaging from "../../../assets/css/manager/ImagingColumn/ImagingColumn.module.css";
import shelf from "../../../assets/image/ImagingColumn/Asset 4@4x.png";

function ImagingColumn({ name, products, openImaging, closeImaging }) {
  const [productsGroup, setProductsGroup] = useState([]);

  const [open, setOpen] = useState(openImaging);

  useEffect(() => {
    let temp = [];
    let group = [];
    products.forEach((product, index) => {
      if (index % 11 === 0 && index !== 0) {
        temp.push(group);
        group = [];
      }
      group.push(product);
    });
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
                                src={"https://picsum.photos/2" + i + index}
                                alt=""
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
