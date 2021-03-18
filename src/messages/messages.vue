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
                privateMessagesRef: firebase.database().ref('privateMessages'),
                messages: [],
                channel: ''
            }
        },

        computed: {
            ...mapGetters(['currentChannel', 'currentUser', 'isPrivate'])
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
                let ref = this.getMessagesRef();
                
                //listen to child added events on current channel
                ref.child(this.currentChannel.id).on('child_added',(snapshot) => {
                    
                    let message = snapshot.val();
                    message['id'] = snapshot.key;

                    this.messages.push(message);

                    //scroll to the top
                    this.$nextTick(() => {
                        $("html, body").scrollTop($(document).height());
                    });
                })
            },

            detachListener(){
                if (this.channel !== null){
                    this.messagesRef.child(this.channel.id).off();
                }
            },

            getMessagesRef(){                
                if(this.isPrivate){
                    return this.privateMessagesRef;
                }
                else{
                    return this.messagesRef;
                }
            }
        },

        beforeDestroy(){
            this.detachListener();
        }
    }
</script>