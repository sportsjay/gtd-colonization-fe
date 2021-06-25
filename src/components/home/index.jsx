import React, { useEffect } from "react";
import axios from "axios";

export default function Page(props) {
  useEffect(() => {
    const config = {
      header: {
        "auth-token": "Bearer " + localStorage.getItem("token"),
      },
    };
    axios.get("http://localhost:4000/user/login", config).then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);
  return <div>home</div>;
}
