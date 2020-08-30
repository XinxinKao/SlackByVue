<template>
    <div>
        <button @click="openModal" class="btn btn-outline-primary">Add Channel</button>

        <!-- show list of channels -->
        <div class="mt-4">
            <button @click="changeChannel(channel)" v-for="channel in channels" v-bind:key="channel" class="list-group-item list-group-item-action" type="button" :class="{'active': setActiveChannel(channel)}">{{ channel.name }}</button>
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

    export default{
        name: 'Channels',

        data(){
            return {
                new_channel: '',
                errors: [],
                channelsRef: firebase.database().ref('channels'),
                channels: [],
                channel: null
            }
        },

        computed: {
            ...mapGetters(['currentChannel']),
            hsaErrors(){
                return this.errors.length > 0;
                //return false;
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
                });
            },

            detachListener() {
                this.channelsRef.off('child_added');
            },

            //set active channel
            setActiveChannel(channel) {
                return channel.id === this.currentChannel.id;
            },

            //change channel
            changeChannel(channel) {
                this.$store.dispatch('setCurrentChannel', channel);
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