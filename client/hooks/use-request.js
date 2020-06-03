import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    setErrors(null);
    try {
      const response = await axios[method](url, body);
      console.log("response", response);

      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {err.response &&
              err.response.data.errors.map((err) => (
                <li key={err.message}>{err.message}</li>
              ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
