// Custom App Component
import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";
/**
 * This is custom app component
 * Required whenever including any global css
 *  */

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
        {/* We want to share currentUser with all the components */}
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  // Invoke getInitialProps of component
  // When appcomponent has getinitialprops, the components ones dont trigger automatically
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return { currentUser: data.currentUser, pageProps };
};

export default AppComponent;

/**
 * Please note that initial props presented to a custom app component (like this one)
 * are different than the one provided to any other page component.
 * PAGE -> context === {req, res}
 * CUSTOM APP -> context === {Component, ctx: {req, res}}
 */
