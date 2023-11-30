import productStyle from "../../../assets/css/admin/addingProducts/Product.module.css";
import img from "../../../assets/image/manager/0007434_-12-.png";

function Product() {
  return (
    <>
      <div className={productStyle.main}>
        <span>
          <div className={productStyle.productImg}>
            <img src={img} />
          </div>
          <div className={productStyle.productName}>שם מוצר</div>
        </span>
        <span>
          <div className={productStyle.productDetails}>
            <div className={productStyle.Icon}></div>
            <div className={productStyle.Text}>ספק</div>
          </div>
          <div className={productStyle.productDetails}>
            <div className={productStyle.Icon}></div>
            <div className={productStyle.Text}>מחלקה</div>
          </div>
          <div className={productStyle.productDetails}>
            <div className={productStyle.Icon}></div>
            <div className={productStyle.Text}>קטגוריה</div>
          </div>
          <div className={productStyle.productDetails}>
            <div className={productStyle.Icon}></div>
            <div className={productStyle.Text}>ברקוד</div>
          </div>
          <div className={productStyle.productDelete}></div>
        </span>
      </div>
    </>
  );
}

export default Product;
