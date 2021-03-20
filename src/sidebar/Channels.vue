<template>
    <div>
        <button @click="openModal" class="btn btn-outline-primary">Add Channel</button>

        <!-- show list of channels -->
        <div class="mt-4">
            <button @click="changeChannel(channel)" v-for="channel in channels" v-bind:key="channel" 
            class="list-group-item list-group-item-action" type="button" 
            :class="{'active': setActiveChannel(channel)}">{{ channel.name }} 
            <span v-if="getNotification(channel) > 0 && channel.id !== currentChannel.id" class="float-right"> {{ getNotification(channel) }} </span>
            </button>
        </div>

        <!-- Modal copy form bootstrap -->
        <div class="modal fade" id="channelModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-dark">Create New Channel</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <input v-model="new_channel" type="text" id="new_channel" name="new_channel" placeholder="Channel Name" class="form-control">
                    </div>

                    <!-- errors -->
                    <ul class="list-group" v-if="hsaErrors">
                        <li class="list-group-item text-danger" v-for="error in errors" v-bind:key="error">{{ error }}</li>
                    </ul>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button @click="addChannel" type="button" class="btn btn-primary">Add Channel</button>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    import database from 'firebase/database';
    import {mapGetters} from 'vuex';
    import mixin from '../mixins';

    export default{
        name: 'Channels',

        data(){
            return {
                new_channel: '',
                errors: [],
                channelsRef: firebase.database().ref('channels'),
                messagesRef: firebase.database().ref('messages'),
                notificationCount: [],
                channels: [],
                channel: null
            }
        },

        mixins: [mixin],

        computed: {
            ...mapGetters(['currentChannel', 'isPrivate']),
            hsaErrors(){
                return this.errors.length > 0;
                //return false;
            }
        },

        watch: {
            isPrivate(){
                if(this.isPrivate){
                    this.resetNotification();
                }
            }
        },

        methods: {
            openModal() {
                $('#channelModal').appendTo('body').modal('show');
            },

            addChannel(){
                console.log('add channel');
                let self = this;

                self.errors = [];

                //get key to the newly creating channel
                let key = self.channelsRef.push().key;
                console.log('newly creating channel key: ' + key);

                //minimum infor need to create a new channel
                //id and name
                let newChannel = {
                    id: key,
                    name: self.new_channel
                };

                //create new channelsRef
                self.channelsRef.child(key).update(newChannel)
                .then(()=>{
                    self.new_channel = '';
                    $('#channelModal').modal('hide');
                })
                .catch((error)=>{
                    self.errors.push(error.message);
                })
            },

            addListener() {
                //about firebase document
                //child_added is triggered once for each existing child and then again every time a new chlid is added to the specified path.
                this.channelsRef.on('child_added', snapshot => {
                    console.log('listening channelRef on child_added: ', snapshot.val());

                    this.channels.push(snapshot.val());

                    //set current channel
                    if(this.channels.length > 0){
                        //set the first one as current channel
                        this.channel = this.channels[0];

                        //dispatch current channel to store
                        this.$store.dispatch('setCurrentChannel', this.channel);                    
                    }

                    //add count listener to manage the notifications                    
                    this.addCountListener(snapshot.key);
                });
            },

            addCountListener(channelId) {
                this.messagesRef.child(channelId).on('value', snapshot => {
                    this.handleNotications(channelId, this.currentChannel.id, this.notificationCount, snapshot);
                });
            },

            getNotification(channel){
                let notif = 0;

                this.notificationCount.forEach(el => {
                    if(el.id === channel.id){
                        notif = el.notif;
                    }
                });

                return notif;
            },

            detachListener() {
                this.channelsRef.off();

                this.channels.forEach(el => {
                    this.messagesRef.child(el.id).off();
                });
            },

            //set active channel
            setActiveChannel(channel) {
                return channel.id === this.currentChannel.id;
            },

            //change channel
            changeChannel(channel) {
                this.resetNotification();
                this.$store.dispatch('setPrivate', false);
                this.$store.dispatch('setCurrentChannel', channel);

                this.channel = channel;
            },

            resetNotification(){
                let index = this.notificationCount.findIndex(el => el.id === this.channel.id);
                if(index !== -1){
                    this.notificationCount[index].total = this.notificationCount[index].lastKnownTotal;
                    this.notificationCount[index].notif = 0;
                }
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