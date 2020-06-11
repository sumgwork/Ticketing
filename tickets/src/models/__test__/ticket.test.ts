import { Ticket } from "../ticket";

it("implements optimistic concurrency control (occ)", async (done) => {
  // Create a ticket
  const ticket = Ticket.build({
    price: 5,
    title: "concert",
    userId: "123",
  });

  // Save the ticket
  await ticket.save();

  // fetch the ticket twice
  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket.id);

  // make two separate changes ot the tickets
  ticket1!.set({ price: 10 });
  ticket2!.set({ price: 10 });
  // save the first fetched ticket
  await ticket1!.save();
  // save the second fetched ticket, shouldn't be allowed
  try {
    await ticket2!.save();
  } catch (error) {
    return done(); // Done signifies end of test case
  }
  throw new Error("Should not reach this point");
});

it("increments version number on saves", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    price: 5,
    title: "concert",
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
