import { SyntaxNode, Tree, Query, TreeCursor } from "tree-sitter";

export type Block = {
  nodes: SyntaxNode[];
};

export type BlockTree = {
  block: Block;
  children: BlockTree[];
};

export function getBlocks(tree: Tree, queries: Query[]): Block[] {
  const blocks: Block[] = [];

  for (const query of queries) {
    const captures = query.captures(tree.rootNode);

    const nodes = [];
    for (const capture of captures) {
      nodes.push(capture.node);
    }

    blocks.push({ nodes: nodes });
  }

  return blocks;
}

function getBlockTail(block: Block): SyntaxNode | undefined {
  if (block.nodes.length === 0) {
    return undefined;
  } else {
    return block.nodes[block.nodes.length - 1];
  }
}

export function getBlockTrees(cursor: TreeCursor, blocks: Block[]): BlockTree[] {
  const node = cursor.currentNode;

  const trees: BlockTree[] = [];

  if (cursor.gotoFirstChild()) {
    const children = getBlockTrees(cursor, blocks);

    let nodeIsBlock = false;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockTail = getBlockTail(block);
      if (blockTail === undefined) {
        continue;
      }

      if (blockTail! === node) {
        blocks.splice(i, 1);
        trees.push({ block: block, children: children });
        nodeIsBlock = true;
        break;
      }
    }

    if (!nodeIsBlock) {
      trees.push(...children);
    }

    cursor.gotoParent();
  }

  if (cursor.gotoNextSibling()) {
    trees.push(...getBlockTrees(cursor, blocks));
  }

  return trees;
}

export type SupportedLanguage = "rust" | "typescript" | "tsx";
export function getQueryStrings(lang: SupportedLanguage): string[] {
  switch (lang) {
    case "rust":
      return [
        `
      (
          (
              [
                  (attribute_item)
                  (line_comment)
              ] @header
              .
              [
                  (attribute_item)
                  (line_comment)
              ]* @header
          )?
          .
          (function_item) @item
      )
      `,
        `
      (
          (
              [
                  (attribute_item)
                  (line_comment)
              ] @header
              .
              [
                  (attribute_item)
                  (line_comment)
              ]* @header
          )?
          .
          (mod_item) @item
      )
      `,
        `
      (
          (
              [
                  (attribute_item)
                  (line_comment)
              ] @header
              .
              [
                  (attribute_item)
                  (line_comment)
              ]* @header
          )?
          .
          (struct_item) @item
      )
      `,
        `(impl_item) @item`,
      ];
    case "typescript":
      return [
        `
(
  (comment)* @header
  .
  (class_declaration) @item
)
        `,
        `
(
  (comment)* @header
  .
  (method_definition) @item
)
        `,
        `
(
  (comment)* @header
  .
  (function_declaration) @item
)
        `,
        `
(
  (comment)* @header
  .
  (export_statement) @item
)
        `,
      ];
    case "tsx":
      const typescriptQueries = getQueryStrings("typescript");
      const tsxQueries = [`(jsx_element) @item`, "(jsx_self_closing_element) @item"];
      return [...typescriptQueries, ...tsxQueries];
  }
}
