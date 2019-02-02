<template>
  <div>
    Hello
  </div>
</template>

<script>
export default {
  props: {
      isAuthenticated: String
    },
  data(){
    return {
    }
  },
  created(){
  },
  mounted(){
    console.log("isAuthenticated", this.isAuthenticated);
    this.$emit("someprops", "value of props")
  }
}
</script>

<style>

</style>
