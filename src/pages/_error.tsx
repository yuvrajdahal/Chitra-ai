import React from "react";

interface ErrorProps {
  statusCode: number;
}

const Error: React.FC<ErrorProps> = ({ statusCode }) => {
  return (
    <div>
      <h1>
        {statusCode
          ? `An error ${statusCode} occurred on the server`
          : "An error occurred on the client"}
      </h1>
      {/* Custom error page content */}
    </div>
  );
};

export default Error;
