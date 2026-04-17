'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Mail, Phone } from 'lucide-react'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then(setMessages).catch(() => {})
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Messages</h1>
        <p className="text-hotel-muted text-sm mt-1">Contact form submissions from guests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Message List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 text-xs font-semibold tracking-wider uppercase text-hotel-muted">
            {messages.length} Messages
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-hotel-muted">
                <MessageSquare size={28} className="mb-3 text-gray-300" />
                <p className="text-sm">No messages yet.</p>
              </div>
            ) : (
              messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => setActive(msg)}
                  className={`w-full text-left p-4 border-b border-gray-50 hover:bg-sky-50 transition-colors
                    ${!msg.isRead ? 'bg-sky-50/50' : ''}
                    ${active?.id === msg.id ? 'bg-sky-100' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium text-sm ${!msg.isRead ? 'text-hotel-dark' : 'text-hotel-muted'}`}>
                      {msg.name}
                    </span>
                    {!msg.isRead && <span className="w-2 h-2 rounded-full bg-sky-400" />}
                  </div>
                  <p className="text-xs text-hotel-muted truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {active ? (
            <div>
              <h3 className="font-heading text-xl font-semibold text-hotel-dark mb-2">{active.subject}</h3>
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-hotel-muted">
                <span className="flex items-center gap-1"><Mail size={13} /> {active.email}</span>
                {active.phone && <span className="flex items-center gap-1"><Phone size={13} /> {active.phone}</span>}
              </div>
              <div className="bg-gray-50 rounded-lg p-5 text-sm text-hotel-dark leading-relaxed">
                {active.message}
              </div>
              <div className="mt-6">
                <a href={`mailto:${active.email}?subject=Re: ${active.subject}`}
                   className="btn-primary text-xs py-2.5">
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-hotel-muted">
              <Mail size={36} className="mb-3 text-gray-200" />
              <p className="text-sm">Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
