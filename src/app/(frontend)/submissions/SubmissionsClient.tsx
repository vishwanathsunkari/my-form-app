'use client'
import React, { useState } from 'react'
import styles from './submissions.module.css'
import { Contact } from '@/payload-types'

type Stats = { total: number; newCount: number; repliedCount: number }

export function SubmissionsClient({ contacts, stats }: { contacts: Contact[]; stats: Stats }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)

  const filtered = contacts.filter((c) => {
    const matchFilter = filter === 'all' || c.status === filter
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.message.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <main className={styles.page}>
      {/* Header */}
      <div className={styles.top}>
        <div>
          <div className={styles.eyebrow}>Admin</div>
          <h1 className={styles.title}>
            Form <em>submissions</em>
          </h1>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNum}>{stats.total}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={styles.stat}>
            <div className={`${styles.statNum} ${styles.amber}`}>{stats.newCount}</div>
            <div className={styles.statLabel}>New</div>
          </div>
          <div className={styles.stat}>
            <div className={`${styles.statNum} ${styles.green}`}>{stats.repliedCount}</div>
            <div className={styles.statLabel}>Replied</div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterbar}>
        {['all', 'new', 'read', 'replied'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
          >
            {f}
          </button>
        ))}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No submissions</p>
          <p className={styles.emptySub}>
            {search || filter !== 'all' ? 'Try adjusting your filters.' : 'Nothing here yet.'}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((contact) => (
                // ✅ Key on Fragment, not on inner elements
                <React.Fragment key={contact.id}>
                  <tr
                    onClick={() => setOpenId(openId === contact.id ? null : contact.id)}
                    className={styles.row}
                  >
                    <td>
                      <div className={styles.tdName}>{contact.name}</div>
                      <div className={styles.tdEmail}>{contact.email}</div>
                    </td>
                    <td>
                      <div className={styles.msgPreview}>{contact.message}</div>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${styles[`badge_${contact.status ?? 'new'}`]}`}
                      >
                        {contact.status ?? 'new'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.tdDate}>
                        {new Date(contact.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className={styles.tdTime}>
                        {new Date(contact.createdAt).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {openId === contact.id && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={4}>
                        <div className={styles.expandedContent}>
                          <div className={styles.fullMessage}>
                            <strong>Full message</strong>
                            {contact.message}
                          </div>
                          <div className={styles.actions}>
                            <a
                              href={`mailto:${contact.email}`}
                              className={`${styles.actionBtn} ${styles.primary}`}
                            >
                              Reply via email
                            </a>
                            <button className={styles.actionBtn}>Mark as read</button>
                            <button className={styles.actionBtn}>Mark replied</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.countBar}>
        Showing {filtered.length} of {stats.total} submissions
      </div>
    </main>
  )
}
