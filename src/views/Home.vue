<template>
  <HelloWorld
    :isAuthenticated="isAuthenticated"
  >
  </HelloWorld>
</template>

<script>
  import HelloWorld from '../components/HelloWorld'

  export default {
    components: {
      HelloWorld
    },
    props:{
      isAuthenticated:{
        type: Boolean,
      },
    },
    watch:{
      isAuthenticated(){
        console.log("isAuthenticated is changing seen from home");
        console.log("isAuthenticated", this.isAuthenticated)
      }
    },
    mounted(){
      console.log("hello from home", this.isAuthenticated);
    }
  }
</script>
