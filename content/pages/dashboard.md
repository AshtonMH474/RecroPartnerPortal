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
    _template: dashboard
  - heading: |
      # **Opportunities** for You
    filters:
      - label: 'By Interests '
        filter: intrests
        icon: FaTag
      - label: 'New Releases '
        filter: new
        icon: FaStar
    labelView: 'View More '
    labelSaved: Save?
    buttons:
      - label: 'View All Opportunities '
        style: button
        link: '/opportunities '
    _template: opportunites
---

