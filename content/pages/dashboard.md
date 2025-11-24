---
slug: dashboard
title: Dashboard
blocks:
  - heading: |
      # **Welcome**
    filters:
      - label: Papers for You
        filter: papers
        icon: FaPaperclip
        buttons:
          - label: View All Papers
            link: /papers
            style: button
      - label: Sheets for You
        filter: sheets
        icon: FaDatabase
        buttons:
          - label: View All Sheets
            link: /sheets
            style: button
      - label: Statements for You
        filter: statements
        icon: FaRegPaperPlane
        buttons:
          - label: View All Statements
            link: /statements
            style: button
      - label: Recent
        filter: recent
        icon: FaClock
        buttons:
          - label: View Full Activity
            link: /activity
            style: button
    _template: dashboard
  - heading: |
      # **My** Portfolio of Deals
    background: black
    options:
      - label: Deals
        filter: deals
        icon: FaHandsHelping
      - label: Submitted
        filter: tickets
        icon: FaCheckCircle
    noDealsText: You don’t have any submitted Deals yet.
    registerLabel: Register a Deal
    _template: myDeals
---

