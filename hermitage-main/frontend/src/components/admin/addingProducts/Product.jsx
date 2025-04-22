import { useState, useEffect } from "react";
import productStyle from "../../../assets/css/admin/addingProducts/Product.module.css";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import imgProductDefault from "../../../assets/image/products/000.png";
import { TrashIcon, EditIcon, CopyIcon } from "lucide-react";
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;

function Product({ product, deleteProduct, editProduct, handleDuplicate }) {
  const { state, dispatch } = useAdminContext();
  let {
    _id,
    barcode,
    name,
    providerName,
    category,
    subGroupName,
    price,
    isBlocked,
  } = product;
  const [categoryName, setCategoryName] = useState("");
  const [imageError, setImageError] = useState(false);

  let image = `${REACT_APP_PROJECT_IMAGES}${barcode}.png`;

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    if (category) {
      let cat = state.categories.find((cat) => cat.number == category);
      setCategoryName(cat.name);
    }
  }, [state.categories]);

  return (
    <div
      className={
        productStyle.main + " " + (isBlocked ? productStyle.blocked : "")
      }
    >
      <span>
        <div className={productStyle.productImg}>
          <img
            src={imageError ? imgProductDefault : image}
            alt={name}
            onError={handleImageError}
          />
        </div>
        <div className={productStyle.productName}>{name}</div>
      </span>
      <span>
        <div
          className={
            productStyle.productDetails + " " + productStyle.providerName
          }
        >
          <div className={productStyle.Text}>{providerName}</div>
        </div>
        <div className={productStyle.productDetails}>
          <div className={productStyle.Text}>{categoryName}</div>
        </div>
        <div className={productStyle.productDetails}>
          <div className={productStyle.Text}>{subGroupName}</div>
        </div>
        <div className={productStyle.productDetails}>
          <div className={productStyle.Text}>{barcode}</div>
        </div>
        <div className={productStyle.productDetails}>
          <div className={productStyle.Text}>{price}₪</div>
        </div>
        <div className={productStyle.actionButtons}>
          <div
            className={productStyle.newProductDelete}
            onClick={() => deleteProduct(_id)}
          >
            <TrashIcon />
          </div>
          <div
            className={productStyle.newProductDuplicate}
            onClick={() => handleDuplicate(product)}
          >
            <CopyIcon />
          </div>
          <div
            className={productStyle.newProductEdit}
            onClick={() => editProduct(product)}
          >
            <EditIcon />
          </div>
        </div>
      </span>
    </div>
  );
}

export default Product;
