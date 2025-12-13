import { Kafka } from "kafkajs"
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const startSendMailConsumer = async () => {
    try {
        const kafka = new Kafka({
            clientId: 'mail-service',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
        })
        const consumer = kafka.consumer({ groupId: 'mail-service-group' })
        await consumer.connect()
        const topicName = "send-mail"
        await consumer.subscribe({ topic: topicName, fromBeginning: false })
        console.log(`✅ Mail Service is listening to topic: ${topicName}`)

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const { to, subject, html } = JSON.parse(message.value?.toString() || '{}')
                    const transporter = nodemailer.createTransport({
                      host: "smtp.gmail.com",
                      port: 465,
                      secure: true,
                      auth: {
                        user: "sloktulsyan@gmail.com",
                        pass: "gaxtbphpguwomljd",
                      },
                    });
                    await transporter.sendMail({
                        from: "NextHire <No-Reply>",
                        to,
                        subject,
                        html,
                    })
                    console.log(`📧 Email sent to ${to} with subject: ${subject}`)
                } catch (error:any) {
                    console.log(`❌ Failed to send email: ${error.message}`)
                }
            },
        })
    } catch (error:any) {
        console.log(`❌ Mail Service failed to start: ${error.message}`)
    }
}