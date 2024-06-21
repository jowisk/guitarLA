import { useState, useEffect, useMemo } from 'react'
import { db } from '../../data/db'
import type { Guitar, CartItem } from '../../types'



const useCart = () => {
    
    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ?  JSON.parse(localStorageCart) : [] 
      }
    
      const [data] = useState(db)
      const [cart, setCart] = useState(initialCart)
    
      useEffect(() => {
       localStorage.setItem('cart', JSON.stringify(cart)) 
      }, [cart])
    
      const addToCart = (item : Guitar) => {
        const itemIndex = cart.findIndex((guitar) => guitar.id === item.id) 
        
        if(itemIndex >= 0) {
          if(cart[itemIndex].quantity >= 5) return
          const updatedCart = [...cart]
          updatedCart[itemIndex].quantity++
          setCart(updatedCart)
        } else {
          const newItem : CartItem = {...item, quantity: 1}
          setCart([...cart, newItem])
        }
      }
    
      const removeFromCart = (id : Guitar['id']) => {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
      }
    
      const increaseQuantity = (id : Guitar['id']) => {
        const updatedCart = cart.map(item => {
          if(item.id === id && item.quantity < 5) {
            return {
              ...item,
              quantity: item.quantity + 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      const decreaseQuantity = (id : Guitar['id']) => {
        const updatedCart = cart.map(item => {
          if(item.id === id && item.quantity > 1) {
            return {
              ...item,
              quantity: item.quantity - 1
            }
          }
          return item
        })
        setCart(updatedCart)
      }
    
      const clearCart = () => {
        setCart([])
      }

      const isEmpty = useMemo(() => cart.length === 0, [cart])

      const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])
  

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}

export default useCart