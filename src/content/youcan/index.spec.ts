import { expect } from "chai";
import { youcanRu } from "./youcan.ru";
import { youcanEn } from "./youcan.en";

describe( "youcan", () => {
  it ("All language content length should be the same", () => {
    expect(Array.isArray(youcanRu)).to.be.true;
    expect(Array.isArray(youcanEn)).to.be.true;
    expect(youcanRu.length).to.be.equal(youcanEn.length);
  });
});