import productStyle from "../../../assets/css/admin/addingProducts/Product.module.css";
import img from "../../../assets/image/manager/0007434_-12-.png";

function Product({product}) {

  let {barcode, name, providerName, departmentName, categoryName} = product;

  return (
    <>
      <div className={productStyle.main}>
        <span>
          <div className={productStyle.productImg}>
            <img src={img} />
          </div>
          <div className={productStyle.productName}>{name}</div>
        </span>
        <span>
          <div className={productStyle.productDetails + " " + productStyle.providerName}>
            <div className={productStyle.Icon}></div>
            <div className={productStyle.Text}>{providerName}</div>
          </div>
          <div className={productStyle.productDetails}>
            <div className={productStyle.Icon}></div>
            <div className={productStyle.Text}>{departmentName}</div>
          </div>
          <div className={productStyle.productDetails}>
            <div className={productStyle.Icon}></div>
            <div className={productStyle.Text}>{categoryName}</div>
          </div>
          <div className={productStyle.productDetails}>
            <div className={productStyle.Icon}></div>
            <div className={productStyle.Text}>{barcode}</div>
          </div>
          <div className={productStyle.productDelete}></div>
        </span>
      </div>
    </>
  );
}

export default Product;
