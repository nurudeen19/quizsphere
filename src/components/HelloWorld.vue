<script setup>
defineProps({
  msg: String
})
</script>

<template>
  <div>
    <h2>{{ msg }}</h2>
    <p>Edit <code>src/components/HelloWorld.vue</code> to get started.</p>
  </div>
</template>

<style scoped>
h2 {
  color: #42b983;
}
</style>
