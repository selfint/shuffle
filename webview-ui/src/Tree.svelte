<script lang="ts">
  import { children } from "svelte/internal";
  import type { Block, BlockTree } from "./types";

  export let text: string;
  export let tree: BlockTree;
  export let onClickHandler: (block: Block) => void;
  export let selected: Block;
</script>

<main>
  {#if tree.children.length !== 0}
    <div>
      {text.substring(tree.block.nodes[0].startIndex, tree.children[0].block.nodes[0].startIndex)}
    </div>
    {#each tree.children as childTree, i}
      <svelte:self {text} tree={childTree} {onClickHandler} {selected} />
      {#if i !== tree.children.length - 1}
        <div>
          {text.substring(
            tree.children[i].block.nodes[tree.children[i].block.nodes.length - 1].endIndex,
            tree.children[i + 1].block.nodes[0].startIndex
          )}
        </div>
      {/if}
    {/each}
    <div>
      {text.substring(
        tree.children[tree.children.length - 1].block.nodes[
          tree.children[tree.children.length - 1].block.nodes.length - 1
        ].endIndex,
        tree.block.nodes[tree.block.nodes.length - 1].endIndex
      )}
    </div>
  {/if}

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="block"
    on:click={(event) => {
      event.preventDefault();
      onClickHandler(tree.block);
    }}
  >
    {text.substring(tree.block.nodes[0].startIndex, tree.block.nodes[tree.block.nodes.length - 1].endIndex)}
  </div>
</main>

<style>
  .block {
    border-width: 1px;
    border-style: solid;
    margin-left: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: left;
    padding: 5px;
  }
</style>
