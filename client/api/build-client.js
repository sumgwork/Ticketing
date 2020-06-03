import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // we are on server
    // typeof window is undefined when executing in server environment
    // in the browser, window is defined so this condition will not be met

    // When on server, we need to use base url as the URL of the service where ingress is running
    // ServiceName.Namespace.svc.cluster.local
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers, // for host and cookies
    });
  } else {
    // on the browser we can refer to the URL with blank base url, nginx ingress will take care of routing
    // kubectl get namespace, kubectl get services give the full qualified namespace of the URL
    return axios.create({
      baseURL: "/",
    });
  }
};
