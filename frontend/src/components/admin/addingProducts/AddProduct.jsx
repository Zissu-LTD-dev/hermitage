import { useState } from "react";
import EditproductStyle from "../../../assets/css/admin/addingProducts/AddProduct.module.css";

function AddProduct({ product, cancel }) {
  const [newProduct, setNewProduct] = useState(product);
  const { barcode } = product;

  return (
    <>
      <div className={EditproductStyle.main}>
        <div className={EditproductStyle.content}>
          <div className={EditproductStyle.title}>
            עריכת מוצר ברקוד : {barcode}{" "}
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>שם המוצר</div>
            <input type="text" className={EditproductStyle.input} />
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>קטגוריה</div>
            <input type="text" className={EditproductStyle.input} />
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>תת קטגוריה</div>
            <input type="text" className={EditproductStyle.input} />
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>מחיר</div>
            <input type="text" className={EditproductStyle.input} />
          </div>
          <div className={EditproductStyle.productDetails}>
            <div className={EditproductStyle.Text}>ספק</div>
            <input type="text" className={EditproductStyle.input} />
          </div>
          <div className={EditproductStyle.btns}>
            <div className={EditproductStyle.save}>שמור</div>
            <div className={EditproductStyle.cancel} onClick={cancel} >ביטול</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
