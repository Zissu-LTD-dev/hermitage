import addingProducts from "../../assets/css/admin/AddingProducts.module.css";
import Product from "./addingProducts/Product";

function AddingProducts() {
  return (
    <>
        <div className={addingProducts.main}>
            <div className={addingProducts.header}>
                <div className={addingProducts.title}>הוספת מוצרים</div>
                <div className={addingProducts.buttons}>
                    <div className={addingProducts.addProduct}>
                        <div className={addingProducts.addProductIcon}></div>
                        <div className={addingProducts.addProductText}>הוספת מוצר בודד</div>
                    </div>
                    <div className={addingProducts.uploadProducts}>
                        <div className={addingProducts.uploadProductsIcon}></div>
                        <div className={addingProducts.uploadProductsText}>העלאת מוצרים מקובץ אקסל</div>
                    </div>
                </div>
            </div>
            <div className={addingProducts.body}>
                <Product />
                <Product />
                <Product />
                <Product />
                <Product />
                <Product />
                <Product />
                <Product />
                <Product />
            </div>
        </div>
    </>
  )
}

export default AddingProducts