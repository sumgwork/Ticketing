import React from "react";
import axios from "axios";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return (
    <div className="jumbotron">
      {currentUser ? (
        <h1>You are signed in</h1>
      ) : (
        <h1>You are not signed in</h1>
      )}
    </div>
  );
};

LandingPage.getInitialProps = async ({ req }) => {
  const { data } = await buildClient({ req }).get("/api/users/currentuser");
  return data;
};

export default LandingPage;
