<script lang="ts">
  import Tree from "./Tree.svelte";
  import type { Block, BlockTree } from "./types";

  export let text: string;
  export let blockTrees: BlockTree[];
  export let onClickHandler: (block: Block) => void;
  export let selected: Block;
</script>

<main>
  {#if blockTrees.length !== 0}
    {#each blockTrees as tree}
      <Tree {text} {tree} {onClickHandler} {selected} />
    {/each}
  {/if}
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
