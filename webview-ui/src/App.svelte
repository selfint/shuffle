<script lang="ts">
  import { provideVSCodeDesignSystem, vsCodeButton } from "@vscode/webview-ui-toolkit";
  import ContentTree from "./ContentTree.svelte";
  import type { BlockLocationTree } from "./types";
  import { vscode } from "./utilities/vscode";

  // In order to use the Webview UI Toolkit web components they
  // must be registered with the browser (i.e. webview) using the
  // syntax below.
  provideVSCodeDesignSystem().register(vsCodeButton());

  // To register more toolkit components, simply import the component
  // registration function and call it from within the register
  // function, like so:
  //
  // provideVSCodeDesignSystem().register(
  //   vsCodeButton(),
  //   vsCodeCheckbox()
  // );
  //
  // Finally, if you would like to register all of the toolkit
  // components at once, there's a handy convenience function:
  //
  // provideVSCodeDesignSystem().register(allComponents.register());

  let text = "placeholder";
  let blockTrees = [];

  window.addEventListener(
    "message",
    (event: MessageEvent<{ type: string; text: string; blockTrees: BlockLocationTree[] }>) => {
      text = event.data.text;
      blockTrees = event.data.blockTrees;
    }
  );

  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }
</script>

<main>
  <h1>Welcome</h1>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <vscode-button on:click={handleHowdyClick}>Howdy 2!</vscode-button>
  <ContentTree {blockTrees} {text} selected={null} onClickHandler={(s) => {}} />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
  }

  main > * {
    margin: 1rem 0;
  }
</style>
