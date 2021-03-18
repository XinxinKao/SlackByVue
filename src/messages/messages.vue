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
                channel: null,
                listeners: []
            }
        },

        computed: {
            ...mapGetters(['currentChannel', 'currentUser', 'isPrivate'])
        },

        watch: {
            currentChannel: function() {
                //if current channel changes, watch for its messages
                this.detachListener();
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
                });

                this.addToListeners(this.currentChannel.id, ref, 'child_added');
            },

            addToListeners(id, ref, event){
                let index = this.listeners.findIndex(el => {
                    return el.id === id && el.ref === ref && el.event === event;
                });

                if(index === -1){
                    this.listeners.push({id: id, ref: ref, event: evnet});
                }
            },

            detachListener(){
                this.listeners.forEach(listener => {
                    listener.ref.child(listener.id).off(listener.event);
                });

                this.listeners = [];
                this.messages = [];
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