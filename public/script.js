async function makePayment() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const amount = document.getElementById("amount").value;
  
    if (!name || !email || !amount) {
      alert("Please fill all fields");
      return;
    }
  
    const res = await fetch("/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
  
    const data = await res.json();
  
    const options = {
      key: "your_key_id", // Replace with your Razorpay key
      amount: data.amount,
      currency: "INR",
      name: "Tree Donation",
      description: "Thank you for contributing!",
      order_id: data.id,
      handler: async function (response) {
        alert("Payment successful!");
  
        await fetch("/save-donation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            amount,
            payment_id: response.razorpay_payment_id,
          }),
        });
      },
      prefill: { name, email },
      theme: { color: "#00c9a7" },
    };
  
    const rzp = new Razorpay(options);
    rzp.open();
  }
  

  function toggleModal() {
    const modal = document.getElementById("modal");
    modal.style.display = modal.style.display === "block" ? "none" : "block";
  }
  
  // Optional: Close modal on outside click
  window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }

  function handleClick(el) {
    el.classList.add("clicked");
    setTimeout(() => {
      el.classList.remove("clicked");
    }, 400);
  }

