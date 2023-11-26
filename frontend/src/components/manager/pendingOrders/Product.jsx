import product from '../../../assets/css/manager/pendingOrders/Product.module.css'

import img from '../../../assets/image/manager/0007434_-12-.png'

function Product({productData}) {
  let {name, categoryName, barcode, quantity} = productData

  return (
    <div className={product.main}>
      <div className={product.img}>
        <img src={img} alt="product" />
      </div>
      <div className={product.name}>{name}</div>
      <div className={product.category}>{categoryName}</div>
      <div className={product.barcode}>{barcode}</div>
      <div className={product.quantity}>{quantity} יחידות</div>
    </div>
  )
}

export default Product