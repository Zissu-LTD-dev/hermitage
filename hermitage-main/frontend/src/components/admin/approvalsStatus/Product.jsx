import { useState, useEffect } from "react";
import productStyle from "../../../assets/css/admin/approvalsStatus/Product.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import imgProductDefault from "../../../assets/image/products/000.png";
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;

function Product({ productData, onDelete, onDecrease, onIncrease, orderBy }) {
  const { state, dispatch } = useMainContext();
  const [product, setProduct] = useState(productData);
  let { _id, name, price, subGroupName, barcode, quantity, QuantityLimit } =
    product;
  let originalQuantity = product.originalQuantity || quantity;
  let image = `${REACT_APP_PROJECT_IMAGES}${barcode}.png`;
  const [imageError, setImageError] = useState(false);
  const [isQuantityLimit, setIsQuantityLimit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(quantity.toString());

  const handleImageError = () => {
    setImageError(true);
  };

  // Update isQuantityLimit flag when quantity or QuantityLimit changes
  useEffect(() => {
    if (
      (quantity > 0 && QuantityLimit > 0 && quantity % QuantityLimit !== 0) ||
      (QuantityLimit > 0 && quantity > QuantityLimit)
    ) {
      setIsQuantityLimit(true);
    } else {
      setIsQuantityLimit(false);
    }
  }, [quantity, QuantityLimit]);

  // Update input value when quantity changes from outside
  useEffect(() => {
    if (!isEditing) {
      setInputValue(quantity.toString());
    }
  }, [quantity]);

  const handleInputChange = (e) => {
    // Only allow numeric input
    if (/^\d*$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);

    // If the handlers are not provided, don't process the changes
    if (!onIncrease || !onDecrease) {
      setInputValue(quantity.toString());
      return;
    }

    let newValue = parseInt(inputValue, 10) || 0;

    // Handle quantity limits if applicable
    if (QuantityLimit > 0 && newValue > 0) {
      // If value is less than limit but not zero, round up to limit
      if (newValue < QuantityLimit) {
        newValue = QuantityLimit;
      }
      // If value is not a multiple of limit, round to nearest multiple
      else if (newValue % QuantityLimit !== 0) {
        newValue = Math.ceil(newValue / QuantityLimit) * QuantityLimit;
      }
    }

    // Update the displayed value
    setInputValue(newValue.toString());

    // Apply the changes by calling increase/decrease the appropriate number of times
    const diff = newValue - quantity;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        onIncrease(product);
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        onDecrease(product);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur(); // Trigger the blur event to apply changes
    }
  };

  return (
    <div
      className={productStyle.main}
      style={{
        backgroundColor: isQuantityLimit ? "rgba(255, 107, 107, 0.2)" : null,
        border: isQuantityLimit ? "1px solid #ff6b6b" : null,
      }}
    >
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

        {QuantityLimit > 0 && (
          <div className={productStyle.barcode}>
            {isQuantityLimit ? (
              <span style={{ color: "red", fontWeight: "bold" }}>
                מוגבל ל-{QuantityLimit} פריטים{" "}
                {quantity > QuantityLimit ? "(כמות חריגה)" : "(נדרשת מכפלה)"}
              </span>
            ) : (
              <span>מינימום כמות: {QuantityLimit} פריטים</span>
            )}
          </div>
        )}

        {orderBy !== "pending" && (
          <div className={productStyle.barcode}>
            {quantity} פריטים
            {originalQuantity !== quantity && (
              <>
                <br />
                (במקור {originalQuantity} פריטים)
              </>
            )}
          </div>
        )}

        {orderBy === "pending" && onIncrease && onDecrease && onDelete && (
          <>
            <div className={productStyle.quantity}>
              <button
                className={productStyle.decrease}
                onClick={() => onDecrease(product)}
                disabled={quantity <= 0}
              ></button>

              <input
                type='text'
                className={productStyle.quantityNum}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                style={{
                  textAlign: "center",
                  width: "40px",
                  border: isEditing ? "1px solid #007bff" : "none",
                  outline: "none",
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

        {orderBy === "pending" && (!onIncrease || !onDecrease || !onDelete) && (
          <div className={productStyle.barcode}>{quantity} פריטים</div>
        )}
      </span>
    </div>
  );
}

export default Product;
