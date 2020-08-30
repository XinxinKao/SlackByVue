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

    export default{
        name: 'Message',

        components: {
            SingleMessage,
            MessageForm
        },

        data() {
            return {
                messagesRef: firebase.database().ref('messages')
            }
        }

    }
</script>