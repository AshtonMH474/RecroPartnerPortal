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
            link: /my-activity
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
    _template: dashboard
---

