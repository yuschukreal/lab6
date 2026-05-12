const express = require('express')
const nodemailer = require('nodemailer')
const path = require('path')

const app = express()
const PORT = 3333

// Роздача статичних файлів з кореня
app.use(express.static(__dirname))
app.use(express.json())

// Головна сторінка
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// POST /api/contact
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body

  // Валідація
  const errors = {}
  if (!name || name.trim().length < 2) errors.name = "Ім'я обов'язкове (мінімум 2 символи)"
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Некоректний email'
  if (!subject || subject.trim().length < 3) errors.subject = 'Тема обов\'язкова (мінімум 3 символи)'
  if (!message || message.trim().length < 10) errors.message = 'Повідомлення обов\'язкове (мінімум 10 символів)'

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ success: false, errors })
  }

  // Відправка через Mailjet SMTP
  const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 587,
    auth: {
      user: 'YOUR_MAILJET_API_KEY',
      pass: 'YOUR_MAILJET_SECRET_KEY',
    },
  })

  try {
    await transporter.sendMail({
      from: 'EMAIL',
      to: 'EMAIL',
      replyTo: email,
      subject: `[Контакт] ${subject}`,
      text: `Ім'я: ${name}\nEmail: ${email}\n\n${message}`,
    })

    res.json({ success: true, message: 'Лист надіслано!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Помилка надсилання листа' })
  }
})

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`)
})
