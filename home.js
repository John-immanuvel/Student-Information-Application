import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>This is Screen 1</p>

      <Link to="/search">Go to Search Page</Link>
    </div>
  );
}

export default Home;
