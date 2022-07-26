// 引包
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    cartItems: [],
    amount: 0,
    total: 0,
    isLoading: true
}

// 请求后端的url
const url = 'https://course-api.com/react-useReducer-cart-project'

// 创建使用thunk的action
// 第一个参数：推荐使用cartSlice中的name加上此action的名字；将会在redux devTools的面板中显示，便于我们知道这个action来自于哪里
// 第二个参数：回调函数，会等请求结果出来后执行；如果成功从后端获取到了数据，则会将数据放到这个action的payload中！
// 回调函数中可以有参数；
// 此外。第二个参数是toolkit提供给我们的，thunkApi，他身上有很多可能用得着的数据
// 如thunkApi.getState()获取所有的slice的state和thunkApi.dispatch()来发送action
export const getCartItems = createAsyncThunk('cart/getCartItems', async (name, thunkApi) => {
    try {
        // thunkApi.getState()可以获得这个项目所有的slice中的state
        console.log(thunkApi.getState())
        const res = await axios.get(url)
        // 如果成功了，会将请求来的数据放在action.payload中
        // 之后会去到下面的[getCartItems.fulfilled]中
        return res.data
    }catch (e){
        // 如果请求失败，使用thunkApi.rejectWithValue(参数)方法将此方法中的参数放在action.payload中
        // 之后会去到下面的[getCartItems.rejected]中
        return thunkApi.rejectWithValue(e.message)
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.cartItems = []
        },
        removeItem: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload)
        },
        increase: (state, action ) => {
            const product = state.cartItems.find(item => item.id === action.payload.id)
            product.amount++
        },
        decrease: (state, action) => {
            const product = state.cartItems.find(item => item.id === action.payload.id)
            product.amount--
        },
        calculateTotals: (state) => {
            let amount = 0
            let total = 0
            state.cartItems.forEach(item => {
                amount += item.amount
                total += item.amount * item.price
            })

            state.amount = amount
            state.total = total
        }
    },

    // 注意！所有使用了thunk的action要写到extraReducers中，而不是reducers中！
    // 每个使用了thunk的action都要将3个生命周期函数的处理写清楚，也就是pending, fulfilled和rejected
    // 并且要使用中括号包裹
    extraReducers: {
        [getCartItems.pending]: (state) => {
            state.isLoading = true
        },
        [getCartItems.fulfilled]: (state, action) => {
            state.isLoading = false
            // action.payload来自于创建含有thunk的action时的回调函数，promise成功后返回的结果
            // 也就是上面的getCartItems action中的res.json()
            state.cartItems = action.payload
        },
        [getCartItems.rejected]: (state, action) => {
            // 如果getCartItems这个action向后端请求数据失败了，会来到这里
            state.isLoading = false
            console.log(action.payload)
        }
    }
})

export const {
    clearCart,
    removeItem,
    increase,
    decrease,
    calculateTotals,

} = cartSlice.actions

export default cartSlice.reducer
