import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const Signout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "get",
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out ...</div>;
};

export default Signout;
