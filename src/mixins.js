export default{
    methods:{ 
        handleNotications(channelId, currentChannelId, notificationCount, snapshot){
            let lastTotal = 0;

            //find if channelId is already added to notificationCount[]
            let index = notificationCount.findIndex(el => el.id === channelId);

            if(index != -1){
                if(channelId !== currentChannelId) {
                    lastTotal = notificationCount[index].total;

                    if(snapshot.numChildren() - lastTotal > 0){
                        notificationCount[index].notif = snapshot.numChildren() - lastTotal;
                    }
                }
                notificationCount[index].lastKnownTotal = snapshot.numChildren();
            }
            else{
                //push to notificationCount[]
                notificationCount.push({
                    id: channelId,
                    total: snapshot.numChildren(),
                    lastKnownTotal: snapshot.numChildren(),
                    notif: 0
                });
            }
        }
    }
}