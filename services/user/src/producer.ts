import { Kafka, Producer, Admin } from 'kafkajs'
import dotenv from 'dotenv'

dotenv.config()

let producer: Producer
let admin: Admin

export const connectKafka = async () => { 
    try {
        const kafka = new Kafka({
            clientId: 'user-service',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        })

        admin = kafka.admin()

        await admin.connect()

        const topics = await admin.listTopics()
        if (!topics.includes('send-mail')) { 
            await admin.createTopics({
                topics: [{ topic: 'send-mail', numPartitions: 1, replicationFactor: 1 }],
            })
        }

        console.log('✅ Kafka connected and topic ensured.')

        await admin.disconnect()

        producer = kafka.producer()
        await producer.connect()
        
        console.log('✅ Kafka producer connected.')
    } catch (error) {
        console.log('❌ Failed to connect Kafka', error)
    }
}

export const publishToTopic = async (topic: string, message: any) => {
    if (!producer) {
      console.log("Kafka producer is not connected");
      return;
    }

    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        })

        console.log(`✅ Message published to topic ${topic}`)
    } catch (error) {
        console.log(`❌ Failed to publish message to topic ${topic}`, error)
    }
}

export const disconnectKafka = async () => {
    try {
        if (producer) {
            await producer.disconnect()
            console.log('✅ Kafka producer disconnected.')
        }
    } catch (error) {
        console.log('❌ Failed to disconnect Kafka producer', error)
    }
}