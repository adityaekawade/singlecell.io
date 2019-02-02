<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs10 mb-5 mt-5>
        Hello from article!
        <p>Id is : {{id}}</p>
        <v-card>
          <v-card-title>
            <span class="headline">
              {{articleContent.title[0].value}}
            </span>
          </v-card-title>
          <v-card-text>
            {{articleContent.body[0].value}}
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
      })
  }
}
</script>


<style>

</style>
