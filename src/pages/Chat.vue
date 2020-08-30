<template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4 sidebar">
                    <Sidebar></Sidebar>
                </div>

                <div class="col-md-8 content">
                    content
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Sidebar from '../sidebar/sidebar';
    import auth from 'firebase/auth';

    export default{
        name: 'Chat',

        components: {
            Sidebar
        }
    }
</script>

<style scoped>
    .sidebar{
        width: 33.5%;
        display: block;
        float: left;
        position: fixed;
        height: 100%;
        background: #000;
        padding-top: 2em;
        overflow: scroll;
    }

    /* Hide scrollbar for Chrome, Safari and Opera */
    .sidebar::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    .sidebar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }

    .content{
        width: 66%;
        display: block;
        float: left;
        margin-left: 34%;
    }
</style>