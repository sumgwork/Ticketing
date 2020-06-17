
# Ticketing App (Microservices)
Ticket app, leveraging the use of **Microservices**, Kubernetes, Skaffold, Nginx Ingress, NextJS, Node, Express, with **Typescript**.

The aim of the application is to let the users signup and create tickets for events, which others can put on hold, and purchase after paying for it. The ticket is reserved by the buyer for a set amount of time, after which it is released to be bought again if a payment isn't made in that reserved time.

## Architecture
This app consists of several micro-services communicating together through an event-bus implemented with `NATS Streaming Server`. The Services are deployed over a Kubernetes cluster, and share ClusterIP services for communication. An `Ingress Nginx` Load Balancer exposes the app to outside world over a secure channel.

![https://i.ibb.co/g9t57JC/Cluster-Architecture.png](https://i.ibb.co/g9t57JC/Cluster-Architecture.png)

## Development
The app is developed locally using `Skaffold`.

Skaffold let's us run all the services in watched manner on a local machine. With every change, a docker image is created and pushed to the hub, deployed locally and container (pod) is restarted. Sample output log of the running app:
![https://i.ibb.co/sVMc8jk/Sample-logs.png](https://i.ibb.co/sVMc8jk/Sample-logs.png)

### Installation
Clone the Github repository on local machine. There is a separate subdirectory for each service inside the root of the repo. Check all the subdirectories and install local dependencies (optional since it will be leveraged by Skaffold anyways). 

Install **Skaffold** binaries on local machine by running the scripts from [here](https://skaffold.dev/docs/install/).

Also requires installation of **Ingress** scripts from this [link](https://kubernetes.github.io/ingress-nginx/deploy/).

### Local Execution

Before running the app, we need to make few configurations.
1. JWT_KEY - Can be set as a secret with the command mentioned below.
2. STRIPE- Secret and Publish keys - Can be set as secrets.

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<key_goes_here>

kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<key_goes_here>
```

Stripe publish key is required by the Client app.

Once everything is setup, run 
```bash
skaffold dev
```
and wait for the magic to begin. :)



## Common Code

Different services in the app make use of shared code distributed as an NPM module.
[@sg-tickets/common](https://www.npmjs.com/package/@sg-tickets/common)



## Testing
The app has full test coverage, with **supertest** and **jest**. It makes use of an **in-memory-MongoDB** instance.

## CI/CD

GitHub Actions come to rescue here. All Pull-Requests are tested thoroughly before merging to the master branch. Once merged, the Delivery process takes over and deploy the changes to production server hosted over **Digital Ocean**.

# Thank You
