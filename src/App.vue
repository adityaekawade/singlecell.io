<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/" exact>
          <span>
              SingleCell
          </span>
          <span class="font-weight-light">.io</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        v-if="isAuthenticated"
        v-on:click="openLoginModal"
      >
      <router-link to="/create" exact>
        <span class="mr-2">Create</span>
      </router-link>
      </v-btn>
      <v-btn
        flat
        v-if="!isAuthenticated"
        v-on:click="openLoginModal"
      >
        <span class="mr-2">Login</span>
      </v-btn>
      <v-btn
        flat
        v-else
        v-on:click="logoutFromForm"
      >
        <span class="mr-2">Logout</span>
      </v-btn>


    </v-toolbar>

    <v-content>
      <!-- <HelloWorld/> -->
      <router-view
        :isAuthenticated="isAuthenticated"
        v-on:someprops=someprops($event)
      >
      </router-view>

      <div v-if="loginDialog && !isAuthenticated">
        <v-dialog v-model="loginDialog" width="600px">
          <!-- <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn> -->
          <v-card>
            <v-card-title>
              <span class="headline">
                Login
              </span>
            </v-card-title>

            <v-card-text>
              <div v-if="!isAuthenticated">
                <v-text-field
                  name="name"
                  label="username"
                  id="id"
                  v-model="uName"
                ></v-text-field>
                <v-text-field
                  name="name"
                  label="Enter your password"
                  hint="At least 8 characters"
                  min="4"
                  type="password"
                  v-model="uPass"
                ></v-text-field>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat="flat" @click="loginFromForm">sign in</v-btn>
              <v-btn color="green darken-1" flat="flat" @click="loginDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>


    </v-content>
  </v-app>
</template>

<script>
import axios from 'axios';
var basic = require('basic-authorization-header');
import jQuery from 'jquery';
global.jQuery = jQuery;
global.$ = jQuery;


import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted() {
    if (localStorage["username"] && localStorage["csrf_token"]) {
      this.current_user = localStorage.getItem("username");
      this.current_user_uid = localStorage.getItem("current_user_uid");
      this.csrf_token = localStorage.getItem("csrf_token");
      this.basicAuth = localStorage.getItem("basicAuth");
      // this.getUserPosts();
      this.isAuthenticated = true;
    }
  },
  updated(){
    console.log("isAuthenticated in app", this.isAuthenticated)
  },
  data () {
    return {
      isAuthenticated: false,
      loginDialog: false,
      csrf_token: "",
      logout_token: "",
      uName: "",
      uPass: "",
      current_user: "",
      current_user_uid: "",
      basicAuth: "",

    }
  },
  methods: {
    someprops(e){
      console.log("e", e)
    },
    openLoginModal(){
      this.loginDialog = true;
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
              this.loginDialog = false;
              this.current_user = this.uName;
              this.current_user_uid = res.data.current_user.uid;
              this.basicAuth = basic(this.uName, this.uPass);
              this.uName = "";
              this.uPass = "";
              localStorage.setItem("username", this.current_user);
              localStorage.setItem("csrf_token", this.csrf_token);
              localStorage.setItem("current_user_uid", this.current_user_uid);
              localStorage.setItem("basicAuth", this.basicAuth);
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
  }
}
</script>
