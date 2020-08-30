import Vue from 'vue';
import Router from 'vue-router';

import Chat from '../pages/Chat';
import Login from '../pages/Login';
import auth from 'firebase/auth';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Chat',
      component: Chat,
      beforeEnter: (to, from, next) => {
        if (!firebase.auth().currentUser){
          next('/login');
        } else {
          next(); //will go to  '/' path
        }

      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ],
  mode: 'history' //可以讓網址後面的#不見
})
