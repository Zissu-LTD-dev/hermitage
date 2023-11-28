import { useState, useEffect } from 'react';
import approvalsStatus from '../../assets/css/admin/ApprovalsStatus.module.css'
import { useOrderContext } from "../../context/orderContext/OrderContext";
import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

import Order from "./approvalsStatus/Order";



function ApprovalsStatus() {
    const { state, dispatch } = useOrderContext();
    const [loading, setLoading] = useState(false);

    const getOrders = async () => {
        try {
            const res = await fetch(
                `${REACT_APP_BACKEND_URL}admin/getAllOrders`,
                {
                    headers: {
                        authorization: `Bearer ${cookie.get("token")}`,
                    },
                }
            );
            const data = await res.json();
            console.log(data);
            dispatch({ type: "SET_CONFIRMATION_ORDERS", payload: data.orders });
            setLoading(true);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

  return (
    <>
        <div className={approvalsStatus.main}>
            <div className={approvalsStatus.title} >סטטוס אישורים להזמנות</div>
            <div className={approvalsStatus.content} >
                {loading ? state.admin.confirmationOrders.map((order) => <Order key={order._id} orderData={order} />) : <div>טוען...</div>}
            </div>
        </div>
    </>
  )
}

export default ApprovalsStatus