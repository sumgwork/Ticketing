import nats from "node-nats-streaming";
console.clear();
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
}); // stan stands for client here

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    // data is also called message
    console.log("Event published", data); // callback
  });
});
