<template>
    <div>
        <div class="text-light">
            <h4>Users</h4>
                <div class="mt-4">
                    <button @click.prevent="changeChannel(user)" v-for="user in users" v-bind:key="user" class="list-group-item list-group-item-action" type="button" :class="{'active': isActive(user)}">
                        
                        <span :class="{'fa fa-circle online': isOnline(user), 'fa fa-circle offline': !isOnline(user)}"></span>

                        <span>
                            <img :src="user.avatar" height="20" class="img rounded-circle">
                            <span>
                                <a :class="{'text-light': isActive(user)}" href="#">{{ user.name }}</a>
                                <span v-if="getNotification(user) >= 1" class="float-right">{{ getNotification(user) }}</span>
                            </span>
                        </span>
                    </button>
                </div>
        </div>
    </div>
</template>

<script>
    import database from 'firebase/database';
    import {mapGetters} from 'vuex';
    import mixin from '../mixins';

    export default {
        name: 'Users',

        data() {
            return {
                users: [],
                usersRef: firebase.database().ref('users'),
                connectedRef: firebase.database().ref('.info/connected'),
                presenceRef: firebase.database().ref('presence'),
                privateMessagesRef: firebase.database().ref('privateMessages'),
                notificationCount: [],
                channel: null
            }
        },

        mixins: [mixin],

        computed: {
            ...mapGetters(['currentUser', 'currentChannel', 'isPrivate'])
        },

        watch: {
            isPrivate(){
                if(!this.isPrivate){
                    this.resetNotification();
                }
            }
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
                });

                //presenceRef child_added
                this.presenceRef.on('child_added', snapshot => {
                    if(this.currentUser.uid !== snapshot.key) {
                        //pass to user status method
                        this.addStatusToUser(snapshot.key);

                        let channelId = this.getChannelId(snapshot.key);
                        this.privateMessagesRef.child(channelId).on('value', snapshot => {
                            console.log('getChannelId2', channelId, this.currentChannel.id, snapshot);
                            this.handleNotications(channelId, this.currentChannel.id, this.notificationCount, snapshot);
                            console.log('after handleNotications notificationCount:', this.notificationCount);
                        });
                    }
                });

                //presenceRef child_removed
                this.presenceRef.on('child_removed', snapshot => {
                    if(this.currentUser.uid !== snapshot.key) {
                        //pass to user status method
                        this.addStatusToUser(snapshot.key, false);

                        this.privateMessagesRef.child(this.getChannelId(snapshot.key)).off();
                    }
                });

                //returns 'connected' to every user connected to our application
                this.connectedRef.on('value', snapshot => {
                    console.log('connected user:', snapshot);

                    if(snapshot.val() === true) {
                        let ref = this.presenceRef.child(this.currentUser.uid);
                        ref.set(true);
                        ref.onDisconnect().remove();
                    }
                });
            },
            
            //add user status online/offline
            addStatusToUser(userId, connected = true) {
                let index = this.users.findIndex(user => user.uid === userId);
                if(index !== -1) {
                    connected === true ? this.users[index].status = 'online': this.users[index].status = 'offline';
                }
            },

            isOnline(user) {
                return user.status == 'online';
            },

            getNotification(user){
                let channelId = this.getChannelId(user.uid);
                let notif = 0;

                this.notificationCount.forEach(el => {
                    if(el.id === channelId){
                        notif = el.count;
                    }
                });
                console.log('getNotification notif:', notif);
                return notif;
            },

            resetNotification(user = null){
                let channelId = null;

                if(user !== null){
                    channelId = this.getChannelId(user.uid);
                }
                else{
                    channelId = this.channel.id;
                }

                let index = this.notificationCount.findIndex(el => el.id === channelId);
                if(index !== -1){
                    this.notificationCount[index].total = this.notificationCount[index].lastKnownTotal;
                    this.notificationCount[index].notif = 0;
                }
            },

            detachListener() {
                this.usersRef.off();
                this.presenceRef.off();
                this.connectedRef.off();

                this.channels.forEach(el => {
                    this.messagesRef.child(el.id).off();
                })
            },

            changeChannel(user) {
                if(this.channel === null){
                    this.resetNotification(user);
                }
                else{
                    this.resetNotification();
                }

                //to change channel, you need channel id 
                let channelId = this.getChannelId(user.uid);
                let channel = {
                    id: channelId,
                    name: user.name
                };
                
                this.$store.dispatch('setPrivate', true);
                this.$store.dispatch('setCurrentChannel', channel);
            },

            isActive(user) {
                let channelId = this.getChannelId(user.uid);
                return this.currentChannel.id === channelId;
            },

            getChannelId(userId) {
                //use this format to create channel smallerUserId/biggerUserId
                return userId < this.currentUser.uid ? userId + '/' + this.currentUser.uid : this.currentUser.uid + '/' + userId;
            }
        },

        mounted() {
            this.addListener();
        },

        beforeDestroy() {
            this.detachListener();
        }
    }
</script>

<style scoped>
    .online{
        color: green;
    }
    .offline{
        color: red;
    }
</style>