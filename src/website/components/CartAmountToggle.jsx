import '../css/cartamounttoggle.css';

function CartAmountToggle({ amount, setDecrease, setIncrease, setAmount }) {
    return (
        <div className="quantity-container">
            <button className="qty-count qty-count--minus" onClick={() => setDecrease()}>-</button>
            <input className="quantity" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} readOnly={true}></input>
            <button className="qty-count qty-count--add" onClick={() => setIncrease()}>+</button>
        </div>
    )
}

export default CartAmountToggle