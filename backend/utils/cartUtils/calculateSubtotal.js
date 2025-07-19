import Product from "../../model/Product.js"

export const calculateSubtotal = async (items) => {

    try {
        let subtotal = 0
        for (const item of items) {


            const product = await Product.findById(item.productId).select("price")
            if (product) {
                subtotal += product.price * item.quantity

            }
        }
        return subtotal
    } catch (error) {
        console.log(error)
    }



}