import { parser } from "./layout-parser.js";
import { LRLanguage, LanguageSupport, foldService, syntaxTree } from "@codemirror/language";

function textOf(source, node) {
  return node ? source.slice(node.from, node.to) : undefined;
}

export function readLayout(source) {
  const tree = parser.parse(source);
  tree.iterate({
    enter(node) {
      if (node.type.isError) {
        const line = source.slice(0, node.from).split("\n").length;
        throw Object.assign(new Error("Invalid layout syntax"), { line });
      }
    },
  });
  return tree.topNode.getChildren("Statement").map((statement) => {
    const node = statement.firstChild;
    const lineStart = source.lastIndexOf("\n", node.from - 1) + 1;
    const get = (name) => textOf(source, node.getChild(name));
    return {
      kind: node.name,
      line: source.slice(0, node.from).split("\n").length,
      text: textOf(source, node),
      names: node.getChildren("Name").map((child) => textOf(source, child)),
      numbers: node.getChildren("Number").map((child) => Number(textOf(source, child))),
      number: Number(get("SignedNumber") || get("Number")),
      dimensions: get("Dimensions2")?.split(/x/iu).map(Number),
      point: get("Point")?.split(",").map(Number) || [0, 0],
      areaKind: node.firstChild.name.toLowerCase(),
      directions: node.getChild("Directions")?.getChildren("Name").map((child) => textOf(source, child).toLowerCase()),
      url: get("Link")?.slice(1, -1),
      tokens: node.getChildren("ObjectToken").map((token) => {
        const part = (name) => textOf(source, token.getChild(name));
        return {
          text: textOf(source, token),
          name: part("Asset"),
          yaw: part("Rotation")?.slice(1),
          dimensions: part("Size")?.slice(1, -1).split(/x/iu).map(Number),
          child: part("Child")?.slice(1, -1),
          wall: part("Wall")?.slice(1).toLowerCase(),
          url: part("Link")?.slice(1, -1),
          start: token.from - lineStart,
          end: token.to - lineStart,
        };
      }),
    };
  });
}

// Room and floor sections end at the next declaration; layouts end at END.
// Use the same syntax nodes as compilation, including in partially edited documents.
export function layoutFold(state, from) {
  const line = state.doc.lineAt(from);
  const statements = syntaxTree(state).topNode.getChildren("Statement").map((node) => node.firstChild);
  const index = statements.findIndex((node) => node.from >= line.from && node.from <= line.to);
  const header = statements[index];
  if (!header || !["Layout", "Room", "Floor"].includes(header.name)) return;
  let end = header.to;
  let rooms = 0;
  for (const node of statements.slice(index + 1)) {
    if (node.name === "Room") rooms += 1;
    if (header.name === "Layout") {
      if (node.name === "End") return { from: line.to, to: node.to };
      if (["Layout", "Room", "Floor"].includes(node.name)) return;
    } else if ((header.name === "Floor" ? ["Floor", "Layout"] : ["Room", "Floor", "Layout"]).includes(node.name)) {
      break;
    }
    end = node.to;
  }
  if (end > line.to && (header.name !== "Floor" || rooms > 1)) return { from: line.to, to: end };
}

export const layoutLanguage = new LanguageSupport(LRLanguage.define({ parser }), [foldService.of(layoutFold)]);
