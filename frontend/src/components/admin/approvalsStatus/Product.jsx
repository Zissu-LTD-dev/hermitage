import { useState, useEffect } from "react";
import productStyle from "../../../assets/css/admin/approvalsStatus/Product.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import imgProductDefault from "../../../assets/image/products/000.png";
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;

function Product({ productData, onDelete, onDecrease, onIncrease, orderBy }) {
  const { state, dispatch } = useMainContext();
  const [product, setProduct] = useState(productData);
  const [quantityInput, setQuantityInput] = useState(
    productData.quantity.toString()
  );

  let { _id, name, price, subGroupName, barcode, quantity, QuantityLimit } =
    product;
  let originalQuantity = product.originalQuantity || quantity;
  let image = `${REACT_APP_PROJECT_IMAGES}${barcode}.png`;
  const [imageError, setImageError] = useState(false);
  const [isQuantityLimit, setIsQuantityLimit] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const handleImageError = () => {
    setImageError(true);
  };

  // Add handlers for input
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*$/.test(value)) {
      setQuantityInput(value);
    }
  };

  const handleQuantityBlur = () => {
    const newQuantity = quantityInput === "" ? 0 : parseInt(quantityInput);

    // Check if the new quantity is between 0 and QuantityLimit
    if (newQuantity > 0 && newQuantity < QuantityLimit) {
      setQuantityInput(QuantityLimit.toString()); // Round up to QuantityLimit
      setWarningMessage(
        `הכמות עוגלה ל ${QuantityLimit} (מוצר זה מגיע במכפלות של ${QuantityLimit}).`
      );
    } else if (newQuantity % QuantityLimit !== 0) {
      const roundedQuantity =
        Math.floor(newQuantity / QuantityLimit) * QuantityLimit;
      setQuantityInput(roundedQuantity.toString());
      setWarningMessage(
        `הכמות עוגלה ל ${roundedQuantity} (מוצר זה מגיע במכפלות של ${QuantityLimit}).`
      );
    } else {
      setWarningMessage(""); // Clear warning if valid
    }

    // Calculate difference and call appropriate handlers
    const diff = newQuantity - quantity;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        onIncrease(product); // Call onIncrease for each increment
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        onDecrease(product); // Call onDecrease for each decrement
      }
    }
  };

  useEffect(() => {
    if (quantity > QuantityLimit && QuantityLimit > 0) {
      setIsQuantityLimit(true);
    }
  }, [quantity, QuantityLimit]);

  // Add effect to update input when quantity changes
  useEffect(() => {
    setQuantityInput(quantity.toString());
  }, [quantity]);

  return (
    <>
      <div
        className={productStyle.main}
        style={{
          backgroundColor: isQuantityLimit ? "rgba(255, 107, 107, 0.2)" : null,
        }}
      >
        {/* Display warning message if exists */}
        {warningMessage && (
          <div
            className={productStyle.warning}
            style={{
              textAlign: "right",
              direction: "rtl",
              color: "red",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#f8d7da",
            }}
          >
            {warningMessage}
          </div>
        )}
        <span>
          <div className={productStyle.img}>
            <img
              src={imageError ? imgProductDefault : image}
              alt={name}
              onError={handleImageError}
            />
          </div>
          <div className={productStyle.name}>{name}</div>
        </span>
        <span>
          <div className={productStyle.category}>{subGroupName}</div>
          <div className={productStyle.barcode}>{barcode}</div>
          <div className={productStyle.barcode}>{price}₪</div>
          {quantity > QuantityLimit && QuantityLimit > 0 && (
            <div className={productStyle.barcode}>
              מוגבל ל: {QuantityLimit} פריטים
            </div>
          )}
          {orderBy != "pending" && (
            <div className={productStyle.barcode}>
              {" "}
              {quantity} פריטים <br /> ( במקור {originalQuantity} פריטים ){" "}
            </div>
          )}
          {orderBy == "pending" && (
            <>
              <div className={productStyle.quantity}>
                <button
                  className={productStyle.decrease}
                  onClick={() => onDecrease(product)}
                ></button>
                {/* Replace div with input */}
                <input
                  type='text'
                  value={quantityInput}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  className={productStyle.quantityInput}
                  style={{
                    width: "60px",
                    textAlign: "center",
                    padding: "4px",
                    margin: "0 4px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                <button
                  className={productStyle.increase}
                  onClick={() => onIncrease(product)}
                ></button>
              </div>
              <div
                className={productStyle.buttonDelete}
                onClick={() => onDelete(product)}
              ></div>
            </>
          )}
        </span>
      </div>
    </>
  );
}

export default Product;
