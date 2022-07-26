import Navbar from "./components/Navbar";
import CartContainer from "./components/CartContainer";
import {useSelector, useDispatch} from "react-redux"
import {useEffect} from "react";
import {calculateTotals, getCartItems} from "./features/cart/cartSlice";

function App() {
    const { cartItems, isLoading } = useSelector(state => state.cart)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(calculateTotals())
    }, [cartItems]);

    useEffect(()=>{
        // dispatch(getCartItems())
        // 里面的action可以带参数到reducer中
        dispatch(getCartItems('max'))
    }, [])

    if(isLoading)
        return (
            <div className='loading'>
                <h1>Loading...</h1>
            </div>
        )

      return (
          <h2>
            <Navbar />
              <CartContainer />
          </h2>
      )
}
export default App;
