<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 mb-5 mt-5>
        <v-card>
          <v-card-title>
            <span class="headline">
              {{articleContent.title[0].value}}
            </span>
          </v-card-title>
          <v-card-text v-if="articleContent.field_base64image.length>0">
            <img  v-bind:src="articleContent.field_base64image[0].value" alt="">
          </v-card-text>

          <v-card-text
            v-html="articleContent.body[0].value"
          >
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      id: this.$route.params.id,
      articleContent: null,
    }
  },
  created(){
    fetch(`https://singlecell.iobio.io/node/${this.id}?_format=json`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.articleContent = data;

      });
  },
  methods: {
    changeImgHeight(){
      console.log(document.querySelectorAll('img'));
      document.querySelectorAll('img').forEach(x=>{
         x.style.height = '400px'
      })
    }
  },
  updated(){
    console.log("updated");
    this.changeImgHeight();

  }
}
</script>


<style scoped>
</style>
