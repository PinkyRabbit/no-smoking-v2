import { expect } from "chai";
import { motivizerRu } from "./motivizer.ru";
import { motivizerEn } from "./motivizer.en";

describe( "motivizer", () => {
  it ("All language content length should be the same", () => {
    const contentRu = motivizerRu;
    const contentEn = motivizerEn;
    expect(Array.isArray(contentRu)).to.be.true;
    expect(Array.isArray(contentEn)).to.be.true;
    expect(contentRu.length).to.be.equal(contentEn.length);
  });
});