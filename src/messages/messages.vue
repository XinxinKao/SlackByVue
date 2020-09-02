<template>
    <div>
        <SingleMessage></SingleMessage>
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

            }
        }
    }
</script>