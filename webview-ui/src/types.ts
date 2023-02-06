/// <reference types="svelte" />

import type { SyntaxNode } from "tree-sitter";

export type Block = {
  nodes: SyntaxNode[];
};

export type BlockTree = {
  block: Block;
  children: BlockTree[];
};
