<template>
    <div>
        <div class="messageForm">
            <form @submit.prevent="sendMessage">
                <div class="input-group mb-3">
                    <input v-model.trim="message" name="message" id="message" placeholder="Write something" class="form-control mt-3" autofocus>
                
                    <div class="input-group-append">
                        <button @click="sendMessage" class="btn btn-primary mt-3" type="button">&nbsp; Send &nbsp;</button>
                    </div>

                    <div class="input-group-append">
                        <button class="btn btn-warning mt-3" type="button">Upload</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import database from 'firebase/database';

    export default{
        name: 'MessageForm',

        data() {
            return {
                message: '',
                errors: []
            }
        },

        computed: {
            ...mapGetters(['currentChannel', 'currentUser'])
        },

        methods: {
            sendMessage() {
                let self = this;
                
                let newMessage = {
                    content: self.message,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    user: {
                        name: self.currentUser.displayName,
                        avatar: self.currentUser.photoURL,
                        id: self.currentUser.uid
                    }
                }
                
                //use some validation
                if(self.currentChannel !== null){
                    if(self.message.length > 0){
                        
                        self.$parent.messagesRef.child(self.currentChannel.id).push().set(newMessage)
                        .then(()=>{
                            self.$nextTick(() => {
                                $("html, body").scrollTop($(document).height());
                            });
                        })
                        .catch((error)=>{
                            self.errors.push(error.message);
                        });

                        //reset message
                        self.message = '';
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .messageForm {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 67%;
        z-index: 100;
        color: white;
        text-align: center;
        margin-bottom: -16px;
        margin-left: 33.3%;
    }

    input, button {
        height: 50px;
    }
</style>