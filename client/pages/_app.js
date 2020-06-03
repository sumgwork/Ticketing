import "bootstrap/dist/css/bootstrap.css";
import Header from "../components/header";
/**
 * This is custom app component
 * Required whenever including any global css
 *  */

export default ({ Component, pageProps }) => {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
};
