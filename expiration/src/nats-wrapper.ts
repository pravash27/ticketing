import nats, { Stan }  from 'node-nats-streaming'
class NatsWrapper{
    private _client?: Stan
    get client(){
        if(!this._client){
            throw new Error("Connection can not be established");
        }
        return this._client;
    }
    connect(clusterId: string,clientId: string, url: string): Promise<void>{
        console.log(clusterId)
        console.log(clientId)
        console.log(url)
        this._client = nats.connect(clusterId,clientId,{ url })
        return new Promise((resolve,reject) => {
            this.client.on('connect',() => {
                console.log("Connected to NATS")
                resolve()
            })
            this.client.on('error',(e) => {
                console.log("Failed to Connect with NATS")
                reject()
            })
        })
    }
}

export const natsWrapper = new NatsWrapper()

