<template>
  <v-container>
    <v-layout
      wrap
    >
      <v-flex mr-4 ml-4 mt-4 mb-4 xs12>
        <h1 class="display-2 font-weight-bold mb-3">
            Welcome to SingleCell.io
        </h1>
        <br>
      </v-flex>

      <form  action="http://singlecell-io.s3.amazonaws.com/" method="post" enctype="multipart/form-data">
        <input type="input"  name="key" value="firstFile" /><br />
        <input type="file"   name="file" /> <br />
    <!-- The elements after this will be ignored -->
        <input type="submit" name="submit" value="Upload to Amazon S3" />

      </form>

      <p></p>
      <p></p>

      <v-flex xs12>
        <v-flex
          mb-5
          xs12
        >
          <v-card>
            <v-card-title primary-title>
              <h2 class="headline font-weight-bold mb-3">Knowledge Base</h2>
            </v-card-title>
            <v-card-title primary-title>
              <h2 class="headline font-weight-bold mb-3">Genepanel- Generate list of genes</h2>
            </v-card-title>
            <v-card-text pl-5>
              <p>
                <iframe src='http://docs.google.com/gview?url=https://s3.amazonaws.com/singlecell-io/Genepanel-+submission.pdf&embedded=true' style='width:100%; height:1000px;' frameborder='0'></iframe>
              </p>

              <p v-if="knowledgebase.length>1">
                <div
                  v-for="(KnowledgeArticle, i) in knowledgebase"
                  :key="i"
                >
                <h3 style="font-size:18px" ><router-link :to="`/article/${KnowledgeArticle.nid[0].value}/${getTitle(KnowledgeArticle.title[0].value)}`" exact >{{KnowledgeArticle.title[0].value}}</router-link></h3>
                <!-- <h3 style="font-size:18px" ><router-link :to="{ name: 'Article', params: { id: 22 }}" exact >{{KnowledgeArticle.title[0].value}}</router-link></h3> -->
                  <!-- <h3><a style="font-size:18px" v-on:click="getTheArticle(KnowledgeArticle.nid[0].value)">{{KnowledgeArticle.title[0].value}}</a></h3> -->
                  <p v-if="KnowledgeArticle.field_summary.length>0">
                    {{KnowledgeArticle.field_summary[0].value}}
                  </p>
                  <p v-else>Summary not included</p>
                </div>
              </p>
            </v-card-text>
          </v-card>
        </v-flex>

      </v-flex>
      </v-flex>



      <div v-if="articleDialog">
        <v-dialog v-model="articleDialog" width="600px">
          <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">
                {{articleContent.title[0].value}}
              </span>
            </v-card-title>
            <v-card-text>
              {{articleContent.body[0].value}}
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
</template>

<script>
import axios from 'axios';
import jQuery from 'jquery';
global.jQuery = jQuery;
global.$ = jQuery;
var basic = require('basic-authorization-header');


  export default {
    components: {
    },
    props: {
      isAuthenticated:{
        type: Boolean,
      },
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
      }
    },
    updated(){
    },
    mounted(){
      fetch(`https://singlecell.iobio.io/api/knowledgebase?_format=json`)
              .then(response => response.json())
              .then(data => {
                console.log(data);
                this.knowledgebase = data;
              })
              // axios.get(`https://singlecell.iobio.io/api/knowledgebase?_format=json`)
              //     .then(response => {
              //       // this.posts = response.data
              //       console.log("axios response ", response)
              //     })
              //     .catch(e => {
              //       // this.errors.push(e)
              //     })
    },
    beforeDestroy() {
    },
    methods: {
      getTheArticle(id){
        alert("id is "+  id );
        fetch(`https://singlecell.iobio.io/node/${id}?_format=json`)
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                  this.articleContent = data;
                  this.articleDialog = true;
                })
      },
      loginFromForm(){
        var data = {
          "name": this.uName,
          "pass": this.uPass
        }
        var headers = {
          'Content-Type' : 'application/json',
        }

        axios.post(`https://singlecell.iobio.io/user/login?_format=json`, data, headers)
              .then(res =>{
                console.log(res);
                this.logout_token = res.data.logout_token;
                this.csrf_token = res.data.csrf_token;
                this.isAuthenticated = true;
                this.current_user = this.uName;
                this.current_user_uid = res.data.current_user.uid;
                this.basicAuth = basic(this.uName, this.uPass);
                this.uName = "";
                this.uPass = "";
                localStorage.setItem("username", this.current_user);
                localStorage.setItem("csrf_token", this.csrf_token);
                localStorage.setItem("current_user_uid", this.current_user_uid);
                localStorage.setItem("basicAuth", this.basicAuth);
                this.getUserPosts();
              })
              .catch(e =>{
                console.log(e)
              })
      },
      logoutFromForm(){
        this.isAuthenticated = false;
        localStorage.removeItem("username");
        localStorage.removeItem("csrf_token");
        localStorage.removeItem("current_user_uid");
        localStorage.removeItem("basicAuth");
      },
      getUserPosts(){
        fetch(`https://singlecell.iobio.io/api/knowledgebase/uid/${this.current_user_uid}?_format=json`)
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                  this.userPosts = data;
                })
      },
      getTitle(title){
        return title.replace(/\s+/g, '-');
      },
      logoutUser(){
        var data = {
        }
        var headers = {
          'Content-Type' : 'application/json',
        }

        axios.post(`https://singlecell.iobio.io/user/logout?_format=json&token=${this.logout_token}`)
              .then(res =>{
                console.log(res)
              })
              .catch(e =>{
                console.log(e)
              })
      },
    },
    data: () => ({
      csrf_token: "",
      logout_token: "",
      myHTML: "",
      knowledgebase: "",
      uName: "",
      uPass: "",
      // isAuthenticated: false,
      current_user: "",
      current_user_uid: "",
      userPosts: [],
      postBody: "",
      postTitle: "",
      articleContent: "",
      articleDialog: false,
      basicAuth: "",
      image: '',
      base64Img: '',
      previewUploadedImage: false,
    })
  }
</script>

<style>
.ndfHFb-c4YZDc-i5oIFb {
  display: none !important;
}

.ndfHFb-c4YZDc-e1YmVc  {
  display: none !important;
}

.ndfHFb-c4YZDc-Wrql6b  {
  display: none !important;
}

</style>
