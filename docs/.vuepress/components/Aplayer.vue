<template></template>

<script>
export default {
  mounted() {
    let aplayer = document.getElementsByClassName("aplayer-body")[0];
    if (!aplayer) return;
    aplayer.style.transform = "translateX(-66px)";
    let miniswitcher = document.getElementsByClassName(
      "aplayer-icon-miniswitcher"
    )[0];
    // 播放器可能还没渲染出迷你开关，取不到就直接跳过，
    // 不能让 mounted 抛错——那会打断 Vue 的挂载流程。
    if (!miniswitcher) return;
    miniswitcher.addEventListener("click", () => {
      let arrow = document.getElementsByClassName("aplayer-arrow")[0];
      if (arrow) {
        aplayer.style.transform = "translateX(0)";
      } else {
        aplayer.style.transform = "translateX(-66px)";
      }
    });
  },
};
</script>

<style>
</style>