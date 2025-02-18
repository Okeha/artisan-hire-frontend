import { Avatar, Button } from "@mui/material";
import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { Modal, Box, Typography, TextField, FormControl } from "@mui/material";

function ArtisanCard({
  _id,
  profilePic,
  firstname,
  lastname,
  stars,
  category,
  price,
  skills,
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);

  const [total, setTotal] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const scopes = ["username", "payments"];

  async function onIncompletePaymentFound(payment) {
    console.log(payment);
    const paymentId = payment.identifier;
    const transactionId = payment.transaction.txid;
    const response = await fetch(
      "https://artisan-hire-backend.onrender.com/api/v1/payments/complete-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, transactionId }),
      }
    );
    console.log(await response.json());
  }
  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    let totalPrice = e.target.value * price;
    setTotal(totalPrice);
  };

  const receivePayment = async (e) => {
    e.preventDefault();
    // console.log(e.target.total.value);

    const amount = e.target.total.value;

    const paymentData = {
      amount,
      memo: `Paid for service: ${category} from ${firstname} ${lastname}`,
      metadata: { kittenId: 1234 },
    };

    //the SDK activates these functions itself
    const paymentCallbacks = {
      onReadyForServerApproval: async (paymentId) => {
        console.log("ready for server approval");
        const response = await fetch(
          "https://artisan-hire-backend.onrender.com/api/v1/payments/approve-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          }
        );

        console.log(await response.json());
        //.. we need to approve the payment
      },
      onReadyForServerCompletion: async (paymentId, transactionId) => {
        //.. we need to complete the payment
        const response = await fetch(
          "https://artisan-hire-backend.onrender.com/api/v1/payments/complete-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, transactionId }),
          }
        );
        console.log(await response.json());
      },
      onCancel: (paymentId) => {
        //..
      },
      onError: (error, payment) => {
        // ...
      },
    };
    Pi.createPayment(paymentData, paymentCallbacks);
  };

  const handlePayment = (e) => {
    // e.preventDefault();
    console.log(e.target_id);
    //check if authenticated

    const createUser = async (username) => {
      const response = await fetch(
        "https://artisan-hire-backend.onrender.com/api/v1/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

      console.log(await response.json());
      if (response.ok) {
        console.log("User created");
      } else {
        alert("Failed to create user");
      }
    };

    const authenticateUser = async () => {
      if (isAuthenticated) {
        handleOpen();
        return alert("Already Authenticated");
      }

      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);

      const token = auth.accessToken;
      const { username } = auth.user;
      const response = await fetch("https://api.minepi.com/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      console.log(data);

      if (data.username === username) {
        createUser(username);
      }

      handleOpen();
      localStorage.setItem("username", username);

      alert("Authenticated");
      setIsAuthenticated(true);
    };
    //if not authenticated, then handle login
    authenticateUser();
  };
  return (
    <>
      <div className="artisan-card">
        <div className="artisan-avatar">
          <Avatar
            alt={firstname + " " + lastname}
            src={profilePic}
            sx={{ width: 80, height: 80 }}
          />
        </div>
        <div className="artisan-info">
          <h2 className="artisan-name">
            {firstname} {lastname}
          </h2>
          <div className="artisan-stars">
            {Array.from({ length: 5 }, (_, index) => (
              <StarIcon
                key={index}
                style={{
                  color: index < stars ? "#FFD700" : "#D3D3D3",
                }}
              />
            ))}
          </div>
          <p className="artisan-category">{category}</p>
          <p className="artisan-price">π {price}/hr</p>
          <div className="artisan-skills">
            {skills.map((skill, index) => (
              <span key={index} className="artisan-skill">
                {skill}
              </span>
            ))}
          </div>
          <Button
            variant="contained"
            style={{ marginTop: "1rem" }}
            onClick={handlePayment}
            name={_id}
            id={_id}
          >
            Pay
          </Button>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="artisan-form-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "60%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="artisan-form-modal"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Artisan Details Form
          </Typography>
          <form onSubmit={receivePayment}>
            <TextField
              label="Full Name"
              name="fullname"
              value={firstname + " " + lastname}
              fullWidth
              margin="normal"
              disabled
            />
            <FormControl fullWidth margin="normal" required>
              <TextField
                label="Category"
                name="category"
                value={category}
                fullWidth
                margin="normal"
                disabled
              />
            </FormControl>
            <TextField
              label="Rate (per hour)"
              name="rate"
              value={`π ${price}/hr`}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Expected Hours"
              name="hours"
              id="hours"
              type="number"
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Total Cost in π "
              name="total"
              id="total"
              type="number"
              value={total}
              fullWidth
              margin="normal"
              disabled
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onSubmit={receivePayment}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default ArtisanCard;
