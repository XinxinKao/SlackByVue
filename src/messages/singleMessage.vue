<template>
    <div>
        <div class="mt-3">
            <div v-for="message in messages" v-bind:key="message">
                <div class="media">
                    <img :src="message.user.avatar" height="50" class="align-self-start mr-3">

                    <div class="media-body">
                        <h6 class="mt-0">
                            <a href="#">{{ message.user.name }}</a> - {{ message.timestamp }}
                        </h6>
                        <p>{{ message.content }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'SingleMessage',
        props: ['messages']
    }
</script>