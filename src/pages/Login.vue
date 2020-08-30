<template>
    <div>
        <div class="jumbotron bg-primary text-white text-center">
            <h2 class="lead display-3">#SLACK#</h2>
            <p>Realtime communication at it's best!</p>
        </div>

        <!-- show loading statue -->
        <div class="alert alert-info" v-if="loading">Processing...</div>

        <!-- show errors -->
        <div class="alert alert-danger" v-if="hsaErrors">
            <div v-for="error in errors" v-bind:key="error">{{ error }}</div>
        </div>

        <div class="container-fluid">
            <div class="row mt-5">
                <div class="col text-center">
                    <button @click="loginWithGoogle" class="btn btn-outline-danger btn-lg">
                        Login with Google
                    </button>
                </div>
            </div>

            <div class="row mt-5">
                <div class="col text-center">
                    <button @click="loginWithTwitter" class="btn btn-outline-info btn-lg">
                        Login with Twitter
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import auth from 'firebase/auth';
    import database from 'firebase/database';

    export default{
        name: 'Login',

        data() {
            return {
                errors: [],
                loading: false,
                usersRef: firebase.database().ref('users')
            }
        },

        computed: {
            hsaErrors(){
                return this.errors.length > 0;
                //return false;
            }
        },

        methods: {
            loginWithGoogle(){
                let self = this;

                self.loading = true;
                self.errors = []; //clear old error message

                firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then(function(response){
                    console.log(response.user);

                    //pass user to save in DB
                    self.saveUserToUsersRef(response.user);

                    //dispatch setUser action
                    self.$store.dispatch('setUser', response.user);

                    //then redirect user to '/' page
                    self.$router.push('/');
                })
                .catch(error => {
                    self.errors.push(error.message);

                    self.loading = false;
                });
            },
            loginWithTwitter(){
                let self = this;

                self.loading = true;
                self.errors = []; //clear old error message

                firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider())
                .then(function(response){
                    console.log(response.user);

                    //dispatch setUser action
                    self.$store.dispatch('setUser', response.user);

                    //then redirect user to '/' page
                    self.$router.push('/');
                })
                .catch(error => {
                    self.errors.push(error.message);

                    self.loading = false;
                });
            },
            saveUserToUsersRef(user){
                return this.usersRef.child(user.uid).set({
                    name: user.displayName,
                    avatar: user.photoURL
                })
            }
        }
    }
</script>

<style scoped>
    .btn, .jumbotron {
        border-radius: 0px;
    }
</style>