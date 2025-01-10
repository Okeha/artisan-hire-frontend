import React, { useEffect, useState } from "react";
import Person2Icon from "@mui/icons-material/Person2";
export default function Navbar() {
  const [username, setUsername] = useState("");
  const getUsername = () => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);
  return (
    <div
      style={{
        borderBottom: "1px solid gainsboro",
        height: "3rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      <Person2Icon style={{ marginRight: "2rem", color: "gray" }} />

      <h4>{username}</h4>
    </div>
  );
}
