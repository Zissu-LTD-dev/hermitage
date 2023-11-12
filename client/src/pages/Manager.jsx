
import Sidebar from "../components/manager/Sidebar";

import ProductOrder from "../components/manager/ProductOrder";
import ProductOrderSummary from "../components/manager/ProductOrderSummary";

const productData = {
  image: "",
  details: 'Grey Goose 300 מ"ל ',
  supplier: "אקרמן",
  group: "וויסקי",
  category: "סטנדים",
  barcode: "36295223",
  quantity: 20,
};

function onIncrease() {
  console.log("increase");
  productData.quantity++;
}

function onDecrease() {
  console.log("decrease");
  if(productData.quantity > 0) {
    productData.quantity--;
  }
}

function Manager() {
  return (
    <>
      <Sidebar branchName="סניף נהריה" />
      <ProductOrder productData={productData} onIncrease={onIncrease} onDecrease={onDecrease} />
    </>
  );
}

export default Manager;
