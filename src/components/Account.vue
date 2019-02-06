<template>
  <div>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 mb-2 mt-5>
          <v-card v-if="isAuthenticated">
            <v-card-title>
              <span>
                <center class="headline text-uppercase mt-5">
                  Welcome {{this.current_user}}
                  <br>
                  <small>Your user id is : {{current_user_uid}}</small>
                </center>
              </span>
            </v-card-title>
            <v-card-text>
              <v-flex xs12 sm12 md12>
                <h2>Your posts: </h2>
                <p v-if="userPosts.length>1" >
                  <div
                    v-for="(post, i) in userPosts"
                    :key="i"
                  >
                    <h3 class="mt-2 mb-2"><a v-on:click="getTheArticle(post.nid[0].value)">{{post.title[0].value}}</a></h3>
                  </div>
                </p>
              </v-flex>
            </v-card-text>
          </v-card>
          <v-card v-else>
            <h1>Please login!</h1>
          </v-card>
        </v-flex>

        <div v-if="articleDialog">
          <v-dialog v-model="articleDialog" width="800px">
            <!-- <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn> -->
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
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat="flat" @click="articleDialog = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>

      </v-layout>
    </v-container>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
      isAuthenticated: Boolean
    },
  data(){
    return {
      uName: "",
      uPass: "",
      current_user: "",
      current_user_uid: "",
      basicAuth: "",
      csrf_token: "",
      logout_token: "",
      userPosts: [],
      articleContent: "",
      articleDialog: false,

    }
  },
  created(){
  },
  updated(){
    this.changeImgHeight();
  },
  methods: {
    getUserPosts(){
      fetch(`https://singlecell.iobio.io/api/knowledgebase/uid/${this.current_user_uid}?_format=json`)
              .then(response => response.json())
              .then(data => {
                console.log(data);
                this.userPosts = data;
              })
    },
    getTheArticle(id){
      fetch(`https://singlecell.iobio.io/node/${id}?_format=json`)
              .then(response => response.json())
              .then(data => {
                console.log(data);
                this.articleContent = data;
                this.articleDialog = true;
              })
    },
    changeImgHeight(){
      document.querySelectorAll('img').forEach(x=>{
         x.style.height = '300px'
      })
    }
  },
  watch:{
    isAuthenticated(){
      console.log("isAuthenticated is changing from HelloWorld", this.isAuthenticated)
      if(this.isAuthenticated){
        this.current_user = localStorage.getItem("username");
        this.current_user_uid = localStorage.getItem("current_user_uid");
        this.csrf_token = localStorage.getItem("csrf_token");
        this.basicAuth = localStorage.getItem("basicAuth");
        this.getUserPosts();
      }
      else {
        this.articleContent = "";
        this.articleDialog = false;
        this.userPosts = [];
      }
    }
  },
  mounted(){
    console.log("isAuthenticated", this.isAuthenticated);
    if(this.isAuthenticated){
      this.current_user = localStorage.getItem("username");
      this.current_user_uid = localStorage.getItem("current_user_uid");
      this.csrf_token = localStorage.getItem("csrf_token");
      this.basicAuth = localStorage.getItem("basicAuth");
      this.getUserPosts();
    }
  }
}
</script>

<style>

</style>
