---
slug: dashboard
title: Dashboard
blocks:
  - heading: |
      # **Welcome**
    filters:
      - label: Recent
        filter: recent
        icon: FaClock
        buttons:
          - label: View Full Activity
            link: /activity
            style: button
      - label: New White Papers
        filter: papers
        icon: FaPaperclip
        buttons:
          - label: View All Papers
            link: /papers
            style: button
      - label: New Data Sheets
        filter: sheets
        icon: FaDatabase
        buttons:
          - label: View All Sheets
            link: /sheets
            style: button
      - label: New Statements
        filter: statements
        icon: FaRegPaperPlane
        buttons:
          - label: View All Statements
            link: /statements
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
    _template: myOpps
---

