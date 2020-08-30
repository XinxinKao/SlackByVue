<template>
    <div>
        <SingleMessage></SingleMessage>
        <MessageForm></MessageForm>
    </div>
</template>

<script>
    import SingleMessage from './singleMessage';
    import MessageForm from './messageForm';

    export default{
        name: 'Message',

        components: {
            SingleMessage,
            MessageForm
        }

    }
</script>