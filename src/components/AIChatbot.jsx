import { useMemo, useState } from 'react'

function getBotReply(message) {
  const text = message.toLowerCase()

  if (text.includes('barber') || text.includes('spa') || text.includes('groom')) {
    return 'Our barbershop & spa offers grooming and wellness sessions. You can request preferred date/time on the Book page.'
  }
  if (text.includes('game') || text.includes('pool') || text.includes('ludo') || text.includes('chess')) {
    return 'Indoor games include Pool Table, Drinking Ludo, Chess Mat, Jenga Classic, Lyrical Correct, and Do Or Drink.'
  }
  if (text.includes('deposit') || text.includes('40%') || text.includes('payment') || text.includes('price')) {
    return 'Bookings are service-based with no upfront price display. Pick your service, day, and time and our team confirms details.'
  }
  if (text.includes('location') || text.includes('where') || text.includes('address')) {
    return 'Spatos Lounge&Grill is located along the Bypass at Corner Estate, Nairobi.'
  }
  if (text.includes('contact') || text.includes('call') || text.includes('phone')) {
    return 'You can reach us on 0755 088 024 or 0738 187 465, and email spatosplace@gmail.com.'
  }
  if (text.includes('dining') || text.includes('grill') || text.includes('restaurant') || text.includes('menu')) {
    return 'Our Lounge & Grill serves Kenyan favorites, breakfast selections, and signature grill meals daily from 6:30 AM.'
  }
  if (text.includes('event') || text.includes('meeting') || text.includes('conference')) {
    return 'We host small events and business meetings. Use the Events page or Contact page and our team will help you plan.'
  }
  if (text.includes('book') || text.includes('availability') || text.includes('reserve')) {
    return 'You can book directly on the Book page by selecting service, day, and time. If a slot is taken, you will be prompted to choose another.'
  }
  if (text.includes('hello') || text.includes('hi')) {
    return 'Hello and welcome to Spatos Lounge&Grill. Ask me about services, bookings, deposits, events, or location.'
  }

  return 'I can help with service booking availability, dining, events, and location details. What would you like to know?'
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Welcome to Spatos AI Concierge. Ask me about bookings, services, dining, events, or contact details.',
    },
  ])

  const quickPrompts = useMemo(
    () => ['Service booking', 'Lounge location', 'Dining options', 'Event planning'],
    [],
  )

  const sendMessage = (value) => {
    const message = value.trim()
    if (!message) {
      return
    }
    setMessages((prev) => [...prev, { sender: 'user', text: message }])
    setInput('')

    const reply = getBotReply(message)
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }])
    }, 350)
  }

  return (
    <div className="chatbot-shell">
      {isOpen ? (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <p>Spatos AI Concierge</p>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chatbot">
              ×
            </button>
          </div>
          <div className="chatbot-body">
            {messages.map((message, index) => (
              <p key={`${message.sender}-${index}`} className={`chat-msg ${message.sender}`}>
                {message.text}
              </p>
            ))}
          </div>
          <div className="chatbot-prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
          <form
            className="chatbot-input"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage(input)
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question..."
            />
            <button type="submit">Send</button>
          </form>
          <div className="chatbot-handoff">
            <a href="https://wa.me/254755088024" target="_blank" rel="noreferrer">
              Continue on WhatsApp
            </a>
          </div>
        </div>
      ) : null}
      <button type="button" className="chatbot-toggle" onClick={() => setIsOpen((prev) => !prev)} aria-label="Open chat">
        Chat
      </button>
    </div>
  )
}
