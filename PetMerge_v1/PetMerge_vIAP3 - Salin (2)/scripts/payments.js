export function initPayment(){
    window.addEventListener('message', function(event) {
        const message = event.data
        if (!message || typeof message !== 'object') return;
        // Handle payment response
        if (message.type === 'PAYMENT_RESPONSE') {
            handlePaymentResponse(message)
        }
    })
}

export function requestPayment(price){
    const orderId = 'petmerge_item_' + Date.now();
    window.c3_callFunction("purchaseStatus", ["success"]);
    window.parent.postMessage({
    type: 'PAYMENT_REQUEST',
    payload: {
        orderId: orderId,        // Unique order ID
        amount: price,                       // Amount in IDR (10,000 = Rp 10,000)
        items: [                             // Array of items being purchased
        {
            name: 'coin',
            price: price,
            quantity: 1
        }
        ]
    }
    }, '*')
}

function handlePaymentResponse(message) {
    if (message.status === 'success') {
        console.log('Payment successful!', message.data);
        // window.c3_callFunction("claim_item",[1, 1]);
        window.c3_callFunction("purchaseStatus", ["success"]);
        alert('Purchase successful!');
    } 
    else {
        console.error('Payment failed:', message.error);
        window.c3_callFunction("purchaseStatus", ["failed"]);
        alert('Payment failed: ' + message.error);
    }
}  
