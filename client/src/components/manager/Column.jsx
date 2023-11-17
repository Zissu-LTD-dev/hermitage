import { useState, useEffect } from "react"
import column from  "../../assets/css/manager/Column.module.css"


function Column() {
    const [open , setOpen] = useState(false)

    // create fake rows for testing 
    const rows = [
        {
            // row 1
            id: 1,
            products: [
                {
                    id: 1,
                    name: "מוצר 1",
                    price: 10,
                    amount: 1,
                    total: 10
                },
                {
                    id: 2,
                    name: "מוצר 2",
                    price: 20,
                    amount: 2,
                    total: 40
                }
            ]
        },
        {
            // row 2
            id: 2,
            products: [
                {
                    id: 3,
                    name: "מוצר 3",
                    price: 30,
                    amount: 3,
                    total: 90
                },
                {
                    id: 4,
                    name: "מוצר 4",
                    price: 40,
                    amount: 4,
                    total: 160
                }
            ]
        }
    ]

  return (
    <>
        {!open &&  (
            <div className={column.main} >
                <i></i>
                <div className={column.title}>שם העמודה </div>
                <div className={column.imaging}>
                    <i></i>
                </div>
                <div className={column.opening__arrow}>
                    <i></i>
                </div>
            </div>
        )}

        {open && (
            <div className={column.main__open} >
            <i></i>
            <div className={column.title}>שם העמודה </div>
            <div className={column.imaging}>
                <i></i>
            </div>
            <div className={column.closing__arrow}>
                <i></i>
            </div>

            <div className={column.rows}>
                {rows.map((row) => (
                    <h1>בפיתוח</h1>
                ))}                                                             
            </div>
        </div>
        )}
    </>
  )
}

export default Column