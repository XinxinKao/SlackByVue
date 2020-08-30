// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import firebase from 'firebase/app';
import store from './store';
import auth from 'firebase/auth';

Vue.config.productionTip = false;


var firebaseConfig = {
  apiKey: "AIzaSyD9vIanRkFQcyBNuul3u5llLc8tqfJYD1o",
  authDomain: "vuexslack-40f24.firebaseapp.com",
  databaseURL: "https://vuexslack-40f24.firebaseio.com",
  projectId: "vuexslack-40f24",
  storageBucket: "vuexslack-40f24.appspot.com",
  messagingSenderId: "901555823759",
  appId: "1:901555823759:web:0b8ae1893e4f1d81127cfa",
  measurementId: "G-QC0CDXG6KJ"
};
firebase.initializeApp(firebaseConfig);

window.firebase = firebase;

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    store.dispatch('setUser', user);

    new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>'
    });

    //recursion - this function call itself on auth state change
    unsubscribe()
})

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: { App },
//   template: '<App/>'
// })
