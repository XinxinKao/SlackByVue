<template>
    <div>
        <SingleMessage :messages="messages"></SingleMessage>
        <MessageForm></MessageForm>
    </div>
</template>

<script>
    import SingleMessage from './singleMessage';
    import MessageForm from './messageForm';
    import database from 'firebase/database';
    import {mapGetters} from 'vuex';

    export default{
        name: 'Message',

        components: {
            SingleMessage,
            MessageForm
        },

        data() {
            return {
                messagesRef: firebase.database().ref('messages'),
                messages: [],
                channel: ''
            }
        },

        computed: {
            ...mapGetters(['currentChannel'])
        },

        watch: {
            currentChannel: function() {
                //if current channel changes, watch for its messages
                this.messages = [];
                this.addListener();
                this.channel = this.currentChannel;
            }
        },

        methods: {
            addListener() {
                //listen to child added events on current channel
                this.messagesRef.child(this.currentChannel.id).on('child_added',(snapshot) => {
                    this.messages.push(snapshot.val());
                })
            },

            detachListener(){
                if (this.channel !== null){
                    this.messagesRef.child(this.channel.id).off();
                }
            }
        },

        beforeDestroy(){
            this.detachListener();
        }
    }
</script>