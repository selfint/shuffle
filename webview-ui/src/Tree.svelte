<script lang="ts">
  import type { BlockLocation, BlockLocationTree } from "./types";

  export let text: string;
  export let tree: BlockLocationTree;
  export let onClickHandler: (block: BlockLocation) => void;
  export let selected: BlockLocation | undefined;

  $: borderColor = tree.block === selected ? "cadetblue" : "white";
</script>

<main>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="block"
    style="border-color: {borderColor}"
    on:click|self={(event) => {
      event.preventDefault();
      onClickHandler(tree.block);
      console.log(
        `After handler: borderColor=${borderColor} block=${tree.block.start_byte} selected=${selected.start_byte}`
      );
    }}
  >
    {#if tree.children.length !== 0}
      <div>
        {text.substring(tree.block.start_byte, tree.children[0].block.start_byte)}
      </div>
      {#each tree.children as childTree, i}
        <svelte:self {text} tree={childTree} {onClickHandler} {selected} />
        {#if i !== tree.children.length - 1}
          <div>
            {text.substring(tree.children[i].block.end_byte, tree.children[i + 1].block.start_byte)}
          </div>
        {/if}
      {/each}
      <div>
        {text.substring(tree.children[tree.children.length - 1].block.end_byte, tree.block.end_byte)}
      </div>
    {:else}
      {text.substring(tree.block.start_byte, tree.block.end_byte)}
    {/if}
  </div>
</main>

<style>
  .block {
    border-color: white;
    border-width: 1px;
    border-style: solid;
    margin-left: 10px;
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: left;
    padding: 5px;
  }
</style>
