import PetServer from "../examples/pets.js";
import { expect, it, describe } from "vitest";

describe("PetServer", () => {
  it("/pets returns pets", async () => {
    const response = await PetServer.handle(
      new Request("http://localhost/pets"),
    );
    const pets = await response.json();
    expect(pets).not.toBeFalsy();
  });
  it("/pets/:petId returns pet if exists", async () => {
    const response = await PetServer.handle(
      new Request("http://localhost/pets/1"),
    );
    const pet = await response.json();
    expect(pet).not.toBeFalsy();
  });
  it("/pets/:petId throws 404 if pet does not exist", async () => {
    const response = await PetServer.handle(
      new Request("http://localhost/pets/999999"),
    );
    expect(response.status).toBe(404);
  });
});
