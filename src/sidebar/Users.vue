<template>
    <div>
        users
    </div>
</template>

<script>
    import database from 'firebase/database';
    import {mapGetters} from 'vuex';

    export default {
        name: 'Users',

        data() {
            return {
                users: [],
                usersRef: firebase.database().ref('users')
            }
        },

        computed: {
            ...mapGetters(['currentUser'])
        },

        methods: {
            addListener() {
                this.usersRef.on('child_added', (snapshot) => {
                    if(this.currentUser.uid !== snapshot.key) {
                        //build user object and push to users[]
                        let user = snapshot.val();
                        user['uid'] = snapshot.key;
                        user['status'] = 'offline';
                        this.users.push(user);
                    }
                })
            },

            detachListener() {}
        },

        mounted() {
            this.addListener();
        },

        beforeDestroy() {
            this.detachListener();
        }
    }
</script>